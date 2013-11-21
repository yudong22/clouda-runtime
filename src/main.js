define(['device','mbaas'], function( device, mbaas ) {
    
    var clouda = (typeof clouda === 'undefined')?{}:clouda;
    
    clouda.lightapp = function(ak){
        
    };
    clouda.device = device;
    clouda.mbaas = mbaas;
    // clouda.ui;
    
   
   if (typeof window == 'object' && typeof window.document === 'object'){
       window.clouda = clouda;
   }
   return clouda;
});