sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel"
],
function (Controller, MessageToast) {
    "use strict";

    return Controller.extend("com.xtendhr.web.controller.Main", {
        onInit: function () {
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        //Para refrescar la tabla, se tiene el onMainRefresh referenciado aqui
        oRouter.getRoute("RouteMain").attachPatternMatched(this._onMainRefresh, this);
        this.onCallSRV();
        },
        onCallSRV: function(){
            var self = this;
            var path = "/srv/destinations?destinationX=MDFData&path=cust_CompanyShirts_S0023961268?$format=json";
            
            $.ajax({
                url: path,
                type: "GET",
                contentType: "application/json",
                success: function(data){
                    //self.setResponse(JSONObject.stringify(data));
                    // self.getOwnerComponent().getModel("odata").setData(data);
                   // self.getView().getModel("odata");
                    var oModel= new sap.ui.model.json.JSONModel(data);
                    self.getView().setModel(oModel, "odata");
                },
                error: function(){
                    self.MessageToast.show("webservice error");
                }
            });
        },
        _onMainRefresh: function(){
            //Esto refresca la tabla
            this.onCallSRV();
        },
        onCreatePress: function () {
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("RouteCreate");
        },
        onOpenDetailView: function(oEvent) {

            var oButton = oEvent.getSource();
            var oRow = oButton.getParent();
            //Se obtiene la fila seleccionada
            var aCells = oRow.getCells();
            //Se saca el external code
            var externalCode = aCells[0].getText();
            //Se obtiene enrutador para manejar navegacion entre vistas
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            //Se navega a la vista detalles y nos llevamos el external
            oRouter.navTo("detail", {externalCode: externalCode});
        }
    });
});
