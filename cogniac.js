

(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // init
    myConnector.init = function(initCallback) {
        tableau.authType = tableau.authTypeEnum.basic;
        initCallback();
    };

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        // define our columns
        var cols = [{
            id: "tenant_id",
            alias: "Tenant ID",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "name",
            alias: "Tenant Name",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "role",
            alias: "User Role",
            dataType: tableau.dataTypeEnum.string
        }];

        var tableSchema = {
            id: "cogniac_tenants",
            alias: "List of tenants user has access to",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
        //$.getJSON("https://api.cogniac.io/1/users/current/tenants", 

        var val 
        $.ajax
        ({
          type: "GET",
          url: "https://api.cogniac.io/1/users/current/tenants",
          dataType: 'json',
          headers: {
            "Authorization": "Basic " + btoa(tableau.username+":"+tableau.password)},
          success: function (response){
            
            val = response; 
            var tenants = val.tenants,
            tableData = [];

            // Iterate over the JSON object
            for (var i = 0, len = tenants.length; i < len; i++) {
                tableData.push({
                    "tenant_id": tenants[i].tenant_id,
                    "name": tenants[i].name,
                    "role": tenants[i].roles[0],
                });
            }

            table.appendRows(tableData);
            doneCallback();
        }
    })};

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.username = document.getElementById("useremail").value
            tableau.password = document.getElementById("userpassword").value
            tableau.connectionName = "Cogniac Test Connection"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
