sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function (Controller, MessageToast, JSONModel) {
    "use strict";

    return Controller.extend("com.xtendhr.web.controller.Create", {
        onInit: function () {
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.getRoute("RouteCreate").attachPatternMatched(this._onMainRefresh, this);
            
        },
        onSavePress: function() {
            var self = this
            var shirtSize = this.byId("inputShirtSize").getValue();
            var shirtColor = this.byId("inputShirtColor").getValue();
            var employee = this.byId("inputEmployee").getValue();

            if(!shirtColor || !shirtSize) {
                MessageToast.show("Please, all fields are required");
                return;
            }

            var newRecordData = {
                "cust_ShirtSize": shirtSize,
                "cust_ShirtColor": shirtColor,
                "cust_Employee": employee,
            };

            var path = "/srv/postDestination?destinationX=sfodataapi&path=/odata/v2/cust_CompanyShirts_S0023961268";

            $.ajax({
                url: path,
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(newRecordData),
                success: function(response) {
                    MessageToast.show("Creado con Exito");
                    self.onBackMain();
                }.bind(this),
                error: function (xhr, status, error) {
                    MessageToast.show("Error al crear: " + error);
                }
            });
        },
        _onMainRefresh: function() {

        },
        
        onBackMain: function(){
         var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
         oRouter.navTo("RouteMain");       
        }
    });
});
