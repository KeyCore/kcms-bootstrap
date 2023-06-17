import * as fs from 'fs';
import * as path from 'path';

import {
    aws_iam as iam,
    aws_ssm as ssm
} from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class BootstrapBaseAutomation extends Construct {
    public readonly role: iam.Role;

    private loadLambdaContent(filePath: string): String {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        return fileContents;
    }

    constructor(scope: Construct, id: string) {
        super(scope, id);

        // Define a managed policy granting the necessary permissions for the handler
        const executionPolicy = new iam.ManagedPolicy(this, 'ExecutionPolicy', {
            managedPolicyName: 'KCMS-BootstrapBaseAutomation',
            statements: [
                new iam.PolicyStatement({
                    effect: iam.Effect.ALLOW,
                    actions: [
                        'servicecatalog:AcceptPortfolioShare',
                        'servicecatalog:AssociatePrincipalWithPortfolio',
                        'servicecatalog:SearchProvisionedProducts',
                        'servicecatalog:UpdateProvisionedProduct',
                        'servicecatalog:ProvisionProduct',
                        'servicecatalog:DescribeProductAsAdmin',
                    ],
                    resources: ['*'],  // Modify as needed for more restricted access
                }),
                new iam.PolicyStatement({
                    effect: iam.Effect.ALLOW,
                    actions: [
                        'logs:CreateLogGroup',
                        'logs:CreateLogStream',
                        'logs:PutLogEvents'
                    ],
                    resources: ['arn:aws:logs:*:*:*'],
                }),
                new iam.PolicyStatement({
                    sid: "Cloudformation",
                    effect: iam.Effect.ALLOW,
                    actions: [
                        "cloudformation:DescribeStackResource",
                        "cloudformation:DescribeStackResources",
                        "cloudformation:GetTemplate",
                        "cloudformation:List*",
                        "cloudformation:DescribeStackEvents",
                        "cloudformation:DescribeStacks",
                        "cloudformation:CreateStack",
                        "cloudformation:DeleteStack",
                        "cloudformation:DescribeStackEvents",
                        "cloudformation:DescribeStacks",
                        "cloudformation:GetTemplateSummary",
                        "cloudformation:SetStackPolicy",
                        "cloudformation:ValidateTemplate",
                        "cloudformation:UpdateStack",
                        "cloudformation:CreateChangeSet",
                        "cloudformation:DescribeChangeSet",
                        "cloudformation:ExecuteChangeSet",
                        "cloudformation:DeleteChangeSet"
                    ],
                    resources: ["*"]
                }),
                new iam.PolicyStatement({
                    effect: iam.Effect.ALLOW,
                    actions: [
                        "iam:GetRole",
                        "iam:CreateRole",
                        "iam:TagRole",
                        "iam:CreatePolicy"
                    ],
                    resources: ['*'],
                }),
                new iam.PolicyStatement({
                    effect: iam.Effect.ALLOW,
                    actions: [
                        "s3:GetObject",
                        "s3:ListBucket",
                        "s3:CreateBucket"
                    ],
                    resources: ['*'],
                }),                
            ]
        });

        // Create an IAM role and attach the managed policy to it
        const executionRole = new iam.Role(this, 'ExecutionRole', {
            roleName: 'KCMS-BootstrapBaseAutomation',
            assumedBy: new iam.ServicePrincipal('ssm.amazonaws.com'),
            managedPolicies: [
                iam.ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess') // TODO - reduce permissions
            ]
        });

        new ssm.CfnDocument(this, 'Document', {
            content: {
                schemaVersion: '0.3',
                assumeRole: executionRole.roleArn,
                description: 'KCMS - Enable Base Automation',
                parameters: {
                    PortfolioId: {
                        type: 'String',
                        description: '(Required) Portfolio Id',
                    },
                    ProductId: {
                        type: 'String',
                        description: '(Required) Product Id',
                    }
                },
                mainSteps: [
                    {
                        name: "EnableBase",
                        action: "aws:executeScript",
                        inputs: {
                            Runtime: "python3.8",
                            Script: this.loadLambdaContent(path.join(__dirname, './runbook-handler/handler.py')),
                            InputPayload:
                                {
                                    PortfolioId: '{{ PortfolioId }}',
                                    PrincipalARN: executionRole.roleArn,
                                    ProductId: '{{ ProductId }}'
                                },
                            Handler: "main"
                        },
                        isCritical: true,
                        maxAttempts: 1,
                        timeoutSeconds: 600
                    }
                ]
            },
            documentFormat: 'JSON',
            documentType: 'Automation',
            name: 'kcms-enable-base',
            tags: [{
                key: 'Name',
                value: 'kcms-enable-base',
            }],
            updateMethod: 'NewVersion',
            versionName: '1.0.13'
        });
    }
}