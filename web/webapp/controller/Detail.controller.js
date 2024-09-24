sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel"
],
function (Controller, MessageToast, JSONModel) {
    "use strict";

    return Controller.extend("com.xtendhr.web.controller.Detail", {
        onInit: function () {
            // Referencia al enrutador asociado
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            // Se registra el controlador para escuchar al evento cuando se va a "detail"
            //Despues de llama a onDetailMatched
            oRouter.getRoute("detail").attachPatternMatched(this._onDetailMatched, this);

            
        
            
        },
        _onDetailMatched: function (oEvent) {
            var self = this;
            //Se obtienen parametros de URL asociados al evento
            var oArgs = oEvent.getParameter("arguments");
            //Se extrae el external Code
            var externalCode = oArgs.externalCode;
            //Se guarda en una variable Global
            self.externalCodeIdGlobal = externalCode;
            

            //Url para la llamada Postmanm "destinations" en server.js, "MDFData" nombre destination
            //El resto, llamada Postman y se mete el external code para completar
            var path = "/srv/destinations?destinationX=MDFData&path=cust_CompanyShirts_S0023961268?$filter= externalCode eq '" + self.externalCodeIdGlobal + "'&$format=json";

            //Solicitud Ajax
            $.ajax({
                url: path,
                type: "GET",
                contentType: "application/json",
                success: function (data) {

                    console.log("Datos recibidos:" , data);

                    var oModel = new sap.ui.model.json.JSONModel(data.d.results[0]);
                    self.getView().setModel(oModel, "odataDetail");
                    

                },
                error: function(){
                    MessageToast.show("Error al cargar los detalles");
                }

            })
        },
        onEditNavPress: function(){
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("RouteEdit", {externalCode: self.externalCodeIdGlobal})
        },

        onEditEnable: function(oEvent){
            var shirtSize = this.byId("inputEditShirtSize").setEditable(true);
            var shirtColor = this.byId("inputEditShirtColor").setEditable(true);
            var BtnEditable = this.byId("BtnSave").setVisible(true);
        },


         onEditSave: function(oEvent){
            var self = this;
            //Meter external COde en IdtoEdit
            var IdtoEdit = self.externalCodeIdGlobal;
            //Extraer el input
            var shirtSize = this.byId("inputEditShirtSize").getValue();
            var shirtColor = this.byId("inputEditShirtColor").getValue();

            console.log("ID es: " + IdtoEdit);
            //Meter el metadata para luego el Ajax de tipo POST
            var updateRecordData = {
                 "__metadata": {
                     "uri": "https://apisalesdemo2.successfactors.eu/odata/v2/cust_CompanyShirts_S0023961268(" + IdtoEdit + ")",
                     "type": "SFOData.cust_CompanyShirts_S0023961268"
                 },
                 "externalCode": IdtoEdit,
                 "cust_ShirtSize": shirtSize,
                 "cust_ShirtColor": shirtColor,
             };
             console.log("Update datos: " + updateRecordData);

             var path = "/srv/editDestination?destinationX=MDFData&path=upsert";

            $.ajax({
                url: path,
                type: "POST",
               contentType: "application/json",
             data: JSON.stringify(updateRecordData),
                success: function (response){
                    MessageToast.show("Edit success");
                    self.onBackMain();
                 }.bind(this),
                 error: function (xhr, status, error) {
                     MessageToast.show("Error on Edit: " + error);
                }
             });

         },
        
        onBackMain: function(){
         var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
         oRouter.navTo("RouteMain");       
        },
        //La funcion onDelete funciona similar a las demas. Se saca external Code y se introduce en la url del path
        //Despues se hace tipo Delete (configurada en server.js)
        onDelete: function(oEvent) {
            var self = this;
            var IdtoDelete = self.externalCodeIdGlobal;
            var path = "/srv/deleteDes?destinationX=MDFData&path=cust_CompanyShirts_S0023961268(" + IdtoDelete + ")";
            console.log(path);
            $.ajax({
                url: path,
                type: "DELETE",
                success: function(data) {
                    MessageToast.show("Registro eleminado con exito");
                    //Se vuelve a la main view
                    self.onBackMain();     
                },
                error: function (){
                    MessageToast.show("Error al borrar");
                }
            });
        }
    });
});
