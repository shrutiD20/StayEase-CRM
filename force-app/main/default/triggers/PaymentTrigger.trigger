trigger PaymentTrigger on Payment__c (after insert) {
    for(Payment__c p : Trigger.new){
        PaymentIntegration.processPayment(p.Booking__c);
    }
}