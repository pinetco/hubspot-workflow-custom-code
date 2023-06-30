/**
 * Associate custom object on update of contact property.
 *
 * In this example `Course Submitted` is the property of contact object and `Course` is the custom object.
 * When filled, this custom code will get the relevant custom object by searching and if found, it will associate
 * the custom object with contact object.
 *
 * Use case:
 * HubSpot doesn't provide a way to use custom objects in forms. The only way to get input
 * from user is with contact property. Association will help in user experience on HubSpot, It can show
 * all relevant information from the connected object rather than just one line text.
 *
 * The same logic can be applied to any type of objects and properties.
 */

const hubspot = require('@hubspot/api-client');

exports.main = async (event, callback) => {
    // Make sure to add your API key under "Secrets" above.
    const hubspotClient = new hubspot.Client({
        accessToken: process.env.api_key
    });

    // getting the value of contact property
    const course = event.inputFields['course_submitted'];
    const contact_id = event.inputFields['contact_id'];

    // destination object type
    const objectType = "courses";

    // search parameters to find destination object
    const PublicObjectSearchRequest = {
        filterGroups: [{
            "filters": [{
                "value": course,
                "propertyName": "course",
                "operator": "EQ"
            }]
        }],
        sorts: ["course"],
        properties: ["course"],
        limit: 1,
        after: 0
    };

    try {
        // search object
        const apiResponse = await hubspotClient.crm.objects.searchApi.doSearch(objectType, PublicObjectSearchRequest);
        // console.log(JSON.stringify(apiResponse, null, 2)); // testing purpose

        // only if object is found...
        if (apiResponse.results.length) {
            const objectId = apiResponse.results[0].id;

            const BatchInputPublicAssociation = {
                inputs: [{
                    "_from": {"id": objectId},
                    "to": {"id": contact_id},
                    "type": "course_to_contact"
                }]
            };
            const fromObjectType = "courses";
            const toObjectType = "contacts";

            const apiResponse = await hubspotClient.crm.associations.batchApi.create(fromObjectType, toObjectType, BatchInputPublicAssociation);
            // console.log(JSON.stringify(apiResponse, null, 2)); // testing purpose
        }
    } catch (e) {
        e.message === 'HTTP request failed'
            ? console.error(JSON.stringify(e.response, null, 2))
            : console.error(e)
    }

    // Use the callback function to output data that can be used in later actions in your workflow.
    callback({
        outputFields: {}
    });
}