module.exports = {

  getRandom : function(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min)
  },

  positiveSentiment2 : function(){
    var sent2 = [
      "On top of the good news, ", 
      "Over and above that, ", 
      "In addition to that, ", 
      "Furthermore, ", 
      "Along with that, ", 
      "At the same time, ", 
      "Simultaneously, ", 
      "Coupled with the good news, ", 
      "In conjunction with that, ", 
      "Correspondingly, ", 
      "In like manner, ", 
      "Superior to the good news, ", 
      "By the same token, ", 
      "Likewise, "
    ];
    return sent2[this.getRandom(0, sent2.length - 1)]
  },

  goodToBadSentiment2 : function(){
    var sent2 = [
      "Contrastingly, ", 
      "sadly, ", 
      "Unfortunately, ", 
      "On the other hand, ", 
      "In reverse, ", 
      "Vice versa, ", 
      "Asymmetrically, ", 
      "Conflictingly, ", 
      "Oppositely, ", 
      "Conversely, ", 
      "On the contrary, ", 
      "Cheerlessly, ", 
      "Dismally, ", 
      "Sorrowfully, ", 
      "Gloomily, ", 
      "Woefully, ", 
      "Badly, ", 
      "Unhappily, ", 
      "Awkwardly, ", 
      "Poorly, ", 
      "Weakly, ", 
      "Clumsily, ", 
      "Unfavorably, ", 
      "Awfully, ", 
      "Unluckily", 
      "Upside down, "
    ];
    return sent2[this.getRandom(0, sent2.length - 1)]
  },

  badToGoodSentiment2 : function(){
    var sent2 = [
      "Contrastingly, ", 
      "On the brightside, ", 
      "Fortunately, ", 
      "On the other hand, ", 
      "In reverse, ", 
      "Vice versa, ", 
      "Uniquely, ", 
      "Asymmetrically, ", 
      "Conflictingly, ", 
      "Oppositely, ", 
      "Conversely, ", 
      "On the contrary, "
    ];
    return sent2[this.getRandom(0, sent2.length - 1)]
  },

  negativeSentiment2 : function(){
    var sent2 = [
      "Sadly, ", 
      "Unfortunately, ", 
      "Cheerlessly, ", 
      "Dismally, ", 
      "Sorrowfully, ", 
      "Gloomily, ", 
      "Woefully, ", 
      "Badly, ", 
      "Unhappily, ", 
      "Awkwardly, ", 
      "Poorly, ", 
      "Weakly, ", 
      "Clumsily, ", 
      "Unfavorably, ", 
      "Awfully, ", 
      "Unluckily"
    ];
    return sent2[this.getRandom(0, sent2.length - 1)]
  },

  neutralSentiment2 : function(){
    var sent2 = [
      "Along with that, ", 
      "Weakly, ", 
      "Unfavorably, ", 
      "And", 
      "Also, ", 
      "At the same time, ", 
      "Simultaneously, ", 
      "By the same token, ", 
      "At the same time, "
    ];
    return sent2[this.getRandom(0, sent2.length - 1)]
  },

  positiveSentiment3 : function(){
    var sent3 = [
      "great. ", 
      "good. ", 
      "awesome. ", 
      "wonderful. ", 
      "fabulous. ", 
      "superb. ", 
      "phenomenal. ", 
      "beautiful. ", 
      "charming. ", 
      "superior. ",
      "excellent. ", 
      "nice. ", 
      "exciting. ", 
      "amazing. ", 
      "prime. ", 
      "gnarly. ", 
      "ace. ", 
      "satisfying. ", 
      "marvelous. ", 
      "splendid. ", 
      "peaceful. ", 
      "pleasant. ", 
      "overjoyed. ", 
      "blessed. ", 
      "gleeful. ", 
      "looking good. ", 
      "lively. ", 
      "thrilled. ", 
      "ecstatic. "
    ];
    return sent3[this.getRandom(0, sent3.length - 1)]
  },

  negativeSentiment3 : function(){
    var sent3 = [
      "poor. ", 
      "awful. ", 
      "terrible. ", 
      "miserable. ", 
      "gloomy. ", 
      "daunting. ", 
      "unhappy. ", 
      "ordinary. ", 
      "unsatisfactory. ", 
      "unhelpful. ", 
      "unpleasant. ", 
      "misbehaving. ", 
      "down. ", 
      "depressed. ", 
      "unfriendly. ", 
      "dissatisfied. ", 
      "discouraged. ", 
      "disturbed. "
    ];
    return sent3[this.getRandom(0, sent3.length - 1)]
  },

  
}


