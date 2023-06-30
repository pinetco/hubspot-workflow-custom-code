/**
 * Add new option to multiselect contact property upon creation of custom object.
 *
 * In this example `Course` is the custom object and when user creates new course, this custom
 * code will update the relevant contact property options.
 *
 * The same logic can be applied to any type of property of object.
 */

const hubspot = require('@hubspot/api-client');

exports.main = async (event, callback) => {
    // Make sure to add your API key under "Secrets" above.
    const hubspotClient = new hubspot.Client({
        accessToken: process.env.api_key
    });

    // getting the value of custom object
    const optionValue = event.inputFields['course'];

    // destination object type and property name
    const objectType = "contact";
    const propertyName = "course_booked";

    try {
        // get property with existing options
        const property = await hubspotClient.crm.properties.coreApi.getByName(objectType, propertyName);

        // adding new option to existing options
        property.options.push({
            "label": optionValue,
            "value": optionValue
        });

        // updating the property
        const apiResponse = await hubspotClient.crm.properties.coreApi.update(objectType, propertyName, property);

        // console.log(JSON.stringify(apiResponse, null, 2)); // testing purpose
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