/*
	(с) Bohdan Fedys
	Функція для запису числа словами на українській мові
	підтримується числа до 999 трильйонів, але можна збільшити доповнивши змінну large
	На вхід передається ціле число і typeOfLastWord яка вказує чи потрібно відмінювати останнє слово:
	
	Numtowords(1781) 	// "одна тисяча сімсот вісімдесят один"
	Numtowords(41, 1) 	// "сорок одна"
*/
function Numtowords(n, typeOfLastWord = 0){
	var teens = [
        "",
        "один",// "одна",
        "два", // "дві"
        "три","чотири","п'ять","шість","сім","вісім","дев'ять","десять",
        "одинадцять","дванадцять","тринадцять","чотирнадцять","п'ятнадцять","шістнадцять","сімнадцять","вісімнадцять","дев'ятнадцять"
    ];
    var tens = [
        "","","двадцять","тридцять","сорок","п'ятдесят","шістдесят","сімдесят","вісімдесят","дев'яносто"
    ];
    var hundreds = [
        "","сто","двісті","триста","чотириста","п'ятсот","шістсот","сімсот","вісімсот","дев'ятсот"
    ];

    var large = [
        "",
        ["тисяча","тисячі","тисяч"],
        ["мільйон","мільйона","мільйонів"],
        ["мільярд","мільярда","мільярдів"],
        ["трильйон","трильйона","трильйонів"]
        // ...
    ];
	
	// "234" -> ["двісті","тридцять","чотири"]
    function say_triple(num){
        var triple = [];
        
		if (num >= 100){
			triple.push(hundreds[parseInt(num / 100)]); // ["двісті"]
			if (num % 100 == 0)
				return triple;
		}
        num %= 100;
        if (num < 20){
            triple.push(teens[parseInt(num)]);
            return triple;
        }
        triple.push(tens[parseInt(num / 10)]); // ["двісті","тридцять"]
        if (num % 10 == 0){
            return triple;
        }
        triple.push(teens[num % 10]); // ["двісті","тридцять","чотири"]
        return triple;
    }
    
	// "1234567" -> ["1","234","567"] 
    function make_triples(s){
        var triples = [];
        for (var i=s.length; i>0; i-=3){
            triples.unshift(s.slice(Math.max(i-3, 0), i));
        }
        return triples;
    }

	var words = [];
	var triples = make_triples(n.toString());
	
	triples.forEach(function(triple, index){
		var triple_num = parseInt(triple);
		if (triple_num == 0)
			return;
		
		var grade = triples.length - 1 - index, // розряд (0 — менше 1000, 1 — більше 1000 і менше 10000000 і тд.)
			type = 0, // відмінювання: "мільйон","мільйона","мільйонів"
			triple_words = say_triple(triple_num),
			triple_last_word = triple_words[triple_words.length - 1];
		
		if (triple[triple.length-1] == "1" && triple[triple.length-2] != "1"){
            type = 0; // 1 мільйон, 21 мільйон
        }else if ("234".match(triple[triple.length-1]) && triple[triple.length-2] != "1")
			type = 1; // 2 мільйона, 3 мільйона...
		else
			type = 2; // 5 мільйонів, 7 мільйонів, 11 мільйонів, 100 мільйонів...
		
		// якщо тисячі — "двадцять ОДНА тисяча ...", чи одиниці але при цьому вказано що слово має відмінюватися (typeOfLastWord==1) — "... сорок ДВІ (гривні)"
		if (grade == 1 || (grade == 0 && typeOfLastWord == 1)){
			if (triple_last_word == "один") 
				triple_words[triple_words.length - 1] = "одна";
			if (triple_last_word == "два") 
				triple_words[triple_words.length - 1] = "дві";
		}
		
		words.push.apply(words, triple_words); // доповнити результуючий масив words масивом triple_words
		
		if (large[grade])	
			words.push(large[grade][type]); // додати "тисячі", "мільйони" і тд.
	});
	
	return words.join(" ");
    
    //return triples;
    //return say_triple(n, type).filter(function(elem){return elem;}).join(" ");
}
