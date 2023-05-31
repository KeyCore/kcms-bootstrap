import * as fs from 'fs';
import * as path from 'path';

import {
    aws_iam as iam,
    aws_ssm as ssm
} from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class BootstrapCoreAutomation extends Construct {
    public readonly role: iam.Role;


    private loadDocumentContent(filePath: string): String {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(fileContents);
    }

    constructor(scope: Construct, id: string) {
        super(scope, id);
        new ssm.CfnDocument(this, 'Document', {
            content: this.loadDocumentContent(path.join(__dirname, './bootstrap-core-document.json')),
            documentFormat: 'YAML',
            documentType: 'Automation',
            name: 'kcms-bootstrap-core',
            tags: [{
                key: 'Name',
                value: 'kcms-bootstrap-core',
            }],
            updateMethod: 'Replace'
        });
    }
}