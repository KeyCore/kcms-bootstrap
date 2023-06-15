import * as cdk from 'aws-cdk-lib';
import {
    aws_s3 as s3,
    cloudformation_include as cfninc,
    aws_iam as iam
} from 'aws-cdk-lib';
import * as constructs from 'constructs';
import * as path from 'path';

export interface AMSOnboardingRoleProps {
    dateOfExpiry?: Date;
}

export class AMSOnboardingRole extends constructs.Construct {
    public readonly role: iam.Role;

    constructor(scope: constructs.Construct, id: string, props: AMSOnboardingRoleProps) {
        super(scope, id);

        // if dateOfExpiry is provided use it, otherwise use 30 days from now
        const future = props.dateOfExpiry ? props.dateOfExpiry : new Date();
        future.setDate(future.getDate() + 30);
        
        new cfninc.CfnInclude(this, 'Template', {
            templateFile: path.join(__dirname, "cfn", "onboarding_role_minimal.json"),
            parameters: {
                'DateOfExpiry': future.toISOString(),
            },
        });
    }
}
