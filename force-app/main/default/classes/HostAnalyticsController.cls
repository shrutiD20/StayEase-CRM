public with sharing class HostAnalyticsController {
    @AuraEnabled(cacheable=true)
    public static List<Map<String, Object>> getPropertyAnalytics(Id hostId) {
        List<AggregateResult> results = [SELECT Property__c propId, SUM(Total_Rent__c) totalRent 
                                        FROM Booking__c 
                                        WHERE Property__c IN (SELECT Id FROM Property__c WHERE Host__c = :hostId) 
                                        AND Status__c = 'Confirmed' 
                                        GROUP BY Property__c];
        
        List<Map<String, Object>> analytics = new List<Map<String, Object>>();
        for (AggregateResult ar : results) {
            Map<String, Object> propertyData = new Map<String, Object>();
            propertyData.put('propertyId', (Id)ar.get('propId'));
            propertyData.put('totalRent', (Decimal)ar.get('totalRent') != null ? (Decimal)ar.get('totalRent') : 0);
            analytics.add(propertyData);
        }

        return analytics;
    }
}