$(function(){
    var stores, money;

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
        
        var f = $("form.mainform").get(0);
        
        if(f.checkValidity()) {
            var sum = parseInt($("#sum").val());
            
            if (!sum || sum <= 0 || sum > 9999999999999){
                return false;
            }
            
            var bill = money[parseInt($("#bills").val())];
            
            if (sum < parseInt(bill.value)){
                alert("Віталій Володимирович, Ви? ;-)\nА Ви в банкоматі також знімаєте " + sum + " " + $("#currency option:selected").text() + " купюрами по " + bill.value + "?\n\n\n...");
                return false;
            }
            
            var amount = parseInt(sum / bill.value);
            var weight = (amount * parseFloat(bill.weight)) / 1000; // kg
            var height = (amount * parseFloat(bill.tall)) / 1000;   // m
            var area = amount * parseFloat(bill.area);              // m2
            var volume = area * (parseFloat(bill.tall) / 1000);     // m3
            
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

            
            $("div.panel.result").show();
            
            location.href = "#result-panel";
            //window.scrollTo(0, document.body.scrollHeight);
        }
        
    });
});