Number.prototype.moneyFormat = function(){
    return this.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1 ');
}

$(function(){
    var stores, money;
    
    var convtype = "cashtokg";

    $.getJSON("money.json", function(json){
        //console.log(json);
        money = json;
    });
    
    $.getJSON("stores.json", function(json){
        //console.log(json);
        stores = json;
    });

    $("#currency").change(function(e){
        $("#bills option").remove();
        var currency = this.value;
        
        $.each(money, function(index, obj){
            if (obj.currency == currency){
                $("#bills").append(new Option(obj.name, obj.id));
            }
        });
    });
    
    $("div.panel.result").hide();
    
    $("#calc").click(function(e){
    
        $("div.panel.result").hide();
        
        var bill = money[parseInt($("#bills").val())];
        
        var f = $("form.mainform").get(0);
        
        if(f.checkValidity()) {
        
            switch (convtype){
            // CASH TO WEIGHT...
            case "cashtokg":
                var sum = parseInt($("#sum").val());
                
                if (!sum || sum <= 0 || sum > 9999999999999){
                    return false;
                }
                
                if (sum < parseInt(bill.value)){
                    alert("Віталій Володимирович, Ви? ;-)\nА Ви в банкоматі також знімаєте " + sum + " " + $("#currency option:selected").text() + " купюрами по " + bill.value + "?\n\n\n...");
                    return false;
                }
                
                var amount = parseInt(sum / bill.value);
                var weight = (amount * parseFloat(bill.weight)) / 1000; // kg
                var height = (amount * parseFloat(bill.tall)) / 1000;   // m
                var area = amount * parseFloat(bill.area);              // m2
                var volume = area * (parseFloat(bill.tall) / 1000);     // m3
                
				$("td.numword").text(Numtowords(sum) + " " + $("#currency option:selected").text());
                $("span.amount").text(amount);
                $("span.weight").text(Math.trunc(weight) + " кг " + Math.round((weight - Math.trunc(weight)) * 1000) + " г");
                $("span.height").text(Math.trunc(height) + " м " + Math.round((height - Math.trunc(height)) * 1000) + " мм");
                $("span.volume").html( (volume * 1000).toFixed(3) + " л, " + volume.toFixed(2) + " м<sup>3</sup>" );
                $("span.area").html( area.toFixed(3) + " м<sup>2</sup>, " + (area / 10000).toFixed(2) + " га, " + (area / 1000000).toFixed(2) + " км<sup>2</sup>" );
                
                
                var index;
                for (index = 0; index < stores.length; index++){
                    if (volume < parseFloat(stores[index].volume))
                        break;
                }
                var store = stores[index];
                
                $("img.store-img").attr("src", "img\\" + store.id + ".jpg");
                $("h2.store-text").text(store.name);

                
                $("div.panel.result-kg").show();
                
                location.href = "#result-panel";
                //window.scrollTo(0, document.body.scrollHeight);
            break;
            
            // WEIGHT TO CASH
            case "kgtocash":
                var kg = parseFloat($("#sum").val());
                if (!kg || kg <= 0 || kg > 9999999999999) return false;
                
                var sum = (kg / (parseFloat(bill.weight) / 1000)) * bill.value;
                
                sum = sum - sum % bill.value; // 123.21 -> 120.00 if 20 bill is selected
                
                var result = sum.moneyFormat() + " " + $("#currency option:selected").text();
                
                $("div.panel.result-money h1").text(result);
                $("div.panel.result.result-money").show();
            break;
            
            // VOLUME TO CASH
            case "m3tocash":
                var volume = parseFloat($("#sum").val());
                if (!volume || volume <= 0 || volume > 9999999999999) return false;
                
                var sum = (volume / (parseFloat(bill.tall) / 1000 * parseFloat(bill.area))) * bill.value;
                
                sum = sum - sum % bill.value;
                
                var result = sum.moneyFormat() + " " + $("#currency option:selected").text();
                
                $("div.panel.result-money h1").text(result);
                $("div.panel.result-money").show();
            break;
            }
        }
        
    });
    
    $("a[data-conv-type]").click(function(event){
        $("div.panel.result").hide();
    
        convtype = $(this).data("conv-type");
        
        $("span.dropdown_caption").html(    $(this).html() );
        $("label[for='sum']").text(         $(this).data("description") );
        $("div.input-group-addon").html(    $(this).data("units") )
        
        $("#sum").val("").focus();
        
        if (convtype == "cashtokg")
            $("#sum").attr("step", "1");
        else
            $("#sum").attr("step", "0.001");
            
        event.preventDefault();
    });
});