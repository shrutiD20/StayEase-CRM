public with sharing class PaymentIntegration {
    @future(callout=true)
    public static void processPayment(Id bookingId) {
        // Query Booking with correct fields
        Booking__c booking = [
            SELECT Id, Name, Guest__r.Name, Advance_Amount__c, Total_Rent__c
            FROM Booking__c
            WHERE Id = :bookingId
            LIMIT 1
        ];

        Http http = new Http();
        HttpRequest req = new HttpRequest();
        req.setEndpoint('callout:DummyPaymentAPI/posts'); // Named Credential
        req.setMethod('POST');
        req.setHeader('Content-Type', 'application/json');

        // Choose amount based on booking type
        Decimal amount = (booking.Advance_Amount__c != null) ? booking.Advance_Amount__c : booking.Total_Rent__c;

        String body = '{"bookingId": "' + booking.Id + 
                      '", "amount": "' + amount + 
                      '", "guest": "' + booking.Guest__r.Name + '"}';
        req.setBody(body);

        HttpResponse res = http.send(req);
        System.debug('Payment Response: ' + res.getBody());
    }
}