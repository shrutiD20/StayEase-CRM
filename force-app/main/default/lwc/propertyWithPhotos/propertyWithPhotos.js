import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import { getRelatedListRecords } from 'lightning/uiRelatedListApi';
import NAME_FIELD from '@salesforce/schema/Property__c.Name';
import HOST_FIELD from '@salesforce/schema/Property__c.Host__c';

const FIELDS = [NAME_FIELD, HOST_FIELD];
const RELATED_FIELDS = ['Property_Photo__c.Property__c', 'Property_Photo__c.Photo__c', 'Property_Photo__c.Name', 'Property_Photo__c.Id'];

export default class PropertyWithPhotos extends LightningElement {
    @api recordId; // Property__c ID
    propertyName;
    hostName;
    photos = [];
    error;

    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    property({ error, data }) {
        if (data) {
            this.propertyName = getFieldValue(data, NAME_FIELD);
            this.hostName = data.fields.Host__c.displayValue || 'N/A'; // Host name from User
            this.error = undefined;
        } else if (error) {
            this.error = error;
        }
    }

    @wire(getRelatedListRecords, {
        parentRecordId: '$recordId',
        relatedListId: 'Property_Photos__r', // Adjust if relationship name differs
        fields: RELATED_FIELDS
    })
    wiredPhotos({ error, data }) {
        if (data) {
            this.photos = data.records.map(record => ({
                id: record.id,
                url: record.fields.Photo__c.value,
                title: record.fields.Name.value || 'Photo', // Use Name as title
                fileType: 'Image' // Derive from URL or add File_Type__c if present
            }));
            this.error = undefined;
        } else if (error) {
            this.error = error;
        }
    }
}