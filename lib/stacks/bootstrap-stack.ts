import * as cdk from 'aws-cdk-lib';
import {
    aws_iam as iam,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Context } from '../../context';
import * as ssm_doc from '@cdklabs/cdk-ssm-documents';



export class BootstrapStack extends cdk.Stack {

    constructor(scope: Construct, id: string, props: cdk.StackProps, context: Context) {
        super(scope, id, props);

        const onboardingRole = new iam.Role(this, 'KeyCoreOnboardingRole', {
            assumedBy: new iam.AccountPrincipal(context.serviceAccount),
            roleName: 'KeyCoreOnboardingRole',
            managedPolicies: [
                iam.ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess')
            ]
        });
        onboardingRole.grantAssumeRole(new iam.AccountPrincipal(context.serviceAccount));

        const productName = 'KeyCoreOnboarding';

        const automationDoc = new ssm_doc.AutomationDocument(this, "BootstrapKeyCoreToolchain", {
            documentFormat: ssm_doc.DocumentFormat.YAML,
            documentName: "BootstrapKeyCoreToolchain"
        });

        automationDoc.addStep(new ssm_doc.AwsApiStep(this, 'AcceptPortfolioShare', {
            service: ssm_doc.AwsService.SERVICE_CATALOG,
            pascalCaseApi: 'AcceptPortfolioShare',
            apiParams: { PortfolioId: [context.portfolioId], PortfolioShareType: ['IMPORTED'] },
            outputs: [],
        }));

        automationDoc.addStep(new ssm_doc.AwsApiStep(this, 'AssociatePrincipalWithPortfolio', {
            service: ssm_doc.AwsService.SERVICE_CATALOG,
            pascalCaseApi: 'AssociatePrincipalWithPortfolio',
            apiParams: { PortfolioId: [context.portfolioId], PrincipalARN: [`arn:aws:iam::${context.serviceAccount}:role/KeyCoreOnboardingRole`], PrincipalType: ['IAM'] },
            outputs: [],
        }));
        
        automationDoc.addStep(new ssm_doc.AwsApiStep(this, 'ProvisionProduct', {
            service: ssm_doc.AwsService.SERVICE_CATALOG,
            pascalCaseApi: 'ProvisionProduct',
            apiParams: { ProductName: [context.toolchainName], ProvisionedProductName: [context.toolchainName], ProvisioningArtifactName: [context.toolchainVersion] },
            outputs: []
        }));
    }

}