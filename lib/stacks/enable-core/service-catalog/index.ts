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
                    ],
                    resources: ['*'],  // Modify as needed for more restricted access
                }),
                new iam.PolicyStatement({
                    effect: iam.Effect.ALLOW,
                    actions: [
                        'logs:CreateLogGroup',
                        'logs:CreateLogStream',
                        'logs:PutLogEvents',
                    ],
                    resources: ['arn:aws:logs:*:*:*'],
                }),
            ]
        });

        // Create an IAM role and attach the managed policy to it
        const executionRole = new iam.Role(this, 'ExecutionRole', {
            roleName: 'KCMS-BootstrapBaseAutomation',
            assumedBy: new iam.ServicePrincipal('ssm.amazonaws.com'),
            managedPolicies: [executionPolicy]
        });

        new ssm.CfnDocument(this, 'Document', {
            content: {
                schemaVersion: '0.3',
                assumeRole: executionRole.roleArn,
                description: 'KCMS - Enable Base Automation',
                mainSteps: [
                    {
                        name: "EnableBase",
                        action: "aws:executeScript",
                        inputs: {
                            Runtime: "python3.8",
                            Script: this.loadLambdaContent(path.join(__dirname, './runbook-handler/handler.py')),
                            Handler: "handler.main"
                        },
                        isCritical: true,
                        maxAttempts: 3,
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
            versionName: '1.0.0'
        });
    }
}