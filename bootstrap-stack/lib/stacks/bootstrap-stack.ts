import * as ssm_doc from '@cdklabs/cdk-ssm-documents';
import * as cdk from 'aws-cdk-lib';
import {
    aws_iam as iam
} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Context } from '../../context';



export class KCMSBootstrapStack extends cdk.Stack {

    constructor(scope: Construct, id: string, props: cdk.StackProps, context: Context) {
        super(scope, id, props);

        const onboardingRole = new iam.Role(this, 'KeyCoreOnboardingRole', {
            assumedBy: new iam.AccountPrincipal(context.serviceAccount),
            roleName: 'KeyCoreOnboardingRole',
            managedPolicies: [
                iam.ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess')
            ]
        });
        onboardingRole.grantAssumeRole(new iam.ServicePrincipal('ssm.amazonaws.com'));

        const automationRole = new iam.Role(this, 'KeyCoreOnboardingAutomationRole', {
            assumedBy: new iam.ServicePrincipal('ssm.amazonaws.com'),
            roleName: 'KeyCoreOnboardingAutomationRole',
            managedPolicies: [
                iam.ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess')
            ]
        });

        const kcmsToolchainProperties = context.kcmsToolchainProperties;

        const automationDoc = new ssm_doc.AutomationDocument(this, "BootstrapKeyCoreToolchain", {
            documentFormat: ssm_doc.DocumentFormat.YAML,
            assumeRole: new ssm_doc.HardCodedString(automationRole.roleArn),
            docInputs: [
                ssm_doc.Input.ofTypeString('AutomationAssumeRole', { defaultValue: automationRole.roleArn }),
                ssm_doc.Input.ofTypeString('ServiceAccount', { defaultValue: context.serviceAccount }),
                ssm_doc.Input.ofTypeString('PortfolioId', { defaultValue: kcmsToolchainProperties.portfolioId }),
                ssm_doc.Input.ofTypeString('ProductName', { defaultValue: kcmsToolchainProperties.productName }),
                ssm_doc.Input.ofTypeString('ProvisionedProductName', { defaultValue: kcmsToolchainProperties.provisionedName }),
                ssm_doc.Input.ofTypeString('Version', { defaultValue: kcmsToolchainProperties.version }),
            ]
        });
        cdk.Tags.of(automationDoc).add('Name', 'BootstrapKeyCoreToolchain');

        automationDoc.addStep(new ssm_doc.AwsApiStep(this, 'AcceptPortfolioShare', {
            service: ssm_doc.AwsService.SERVICE_CATALOG,
            pascalCaseApi: 'AcceptPortfolioShare',
            apiParams: { PortfolioId: "{{PortfolioId}}", PortfolioShareType: 'IMPORTED' },
            outputs: [],
        }));

        automationDoc.addStep(new ssm_doc.AwsApiStep(this, 'AssociatePrincipalWithPortfolio', {
            service: ssm_doc.AwsService.SERVICE_CATALOG,
            pascalCaseApi: 'AssociatePrincipalWithPortfolio',
            apiParams: { PortfolioId: "{{PortfolioId}}", PrincipalARN: automationRole.roleArn, PrincipalType: 'IAM' },
            outputs: [],
        }));

        automationDoc.addStep(new ssm_doc.SleepStep(this, 'Sleep', {
            sleepSeconds: 15
        }));

        automationDoc.addStep(new ssm_doc.AwsApiStep(this, 'ProvisionProduct', {
            service: ssm_doc.AwsService.SERVICE_CATALOG,
            pascalCaseApi: 'ProvisionProduct',
            apiParams: { ProductName: "{{ProductName}}", ProvisionedProductName: "{{ProvisionedProductName}}", ProvisioningArtifactName: "{{Version}}", ProvisioningParameters: [{ Key: "ServiceAccount", Value: "{{ServiceAccount}}" }] },
            outputs: []
        }));

    }

}