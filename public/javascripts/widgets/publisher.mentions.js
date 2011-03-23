/**
 * Created by .
 * User: dan
 * Date: 3/22/11
 * Time: 9:38 AM
 * To change this template use File | Settings | File Templates.
 */

(function() {
  var Mentions = function() {
    this.list = [];
    this.contacts = {};
    this.options = {
      minChars: 1,
      max: 5,
      onSelect: Mentions.onSelect,
      searchTermFormValue: Mentions.searchTermFromValue,
      scroll: false,
      formatItem: function(contact) {
        return "<img src=" + contact.avatar + " class='avatar/>" + contact.name;
      },
      formatMatch: function(contact) {
        return contact.name;
      },
      formatResult: function(contact) {
        return contact.name;
      }
    };

   this._superClass.input.keydown(this.keyDownHandler);
   this._superClass.input.keyup(this.repopulateHiddenInput);
   this._superClass.input.autocomplete(this.contacts, this.options);
  };

  Mentions.prototype.addMentionToInput = function(input, cursorIndex, formatted) {
    var inputContent = input.value,
      stringLoc = this.findStringToReplace(inputContent, cursorIndex),
      stringStart = inputContent.slice(0, stringLoc[0]),
      stringEnd = inputContent.slice(stringLoc[1]),
      offset = formatted.length - (stringLoc[1] - stringLoc[0]);

    input.val(stringStart + formatted + stringEnd);
    this.updateMentionLocations(stringStart.length, offset);

    return [stringStart.length, stringStart.length + formatted.length]
  };

  Mentions.prototype.onSelect = function(input, contact, formatted) {
    input = input.get(0);

    var visibleCursorIndex = input.selectionStart,
      visibleLoc = this.addMentionToInput(visibleInput, visibleCursorIndex, formatted);

    $.Autocompleter.Selection(input, visibleLoc[1], visibleLoc[1]);

    this.list.push({
      visibleStart: visibleLoc[0],
      visibleEnd  : visibleLoc[1],
      mentionString : "@{" + contact.name + ": " + contact.handle + "}",
    });

    this._superClass.hiddenInput().val(this.generateHiddenInput());
  };

  Mentions.prototype.sortList = function() {
    return this.list.sort(function(m1, m2){
      if (m1.visibleStart > m2.visibleStart) {
        return -1;
      } else if(m1.visibleStart < m2.visibleStart){
        return 1;
      } else {
         return 0;
      }
    });
  };

  Mentions.prototype.generateHiddenInput = function(visibleString) {
    var resultString = visibleString;
    for(var i in this.sortList()){
      var mention = this.mentions[i],
        start = resultString.slice(0, mention.visibleStart),
        insertion = mention.mentionString,
        end = resultString.slice(mention.visibleEnd);

      resultString = start + insertion + end;
    }

    return resultString;
  };

  Mentions.prototype.searchTermFromValue = function(cursorIndex) {
    var stringLoc = this.findStringToReplace(value, cursorIndex);
    if(stringLoc[0] <= 2){
      stringLoc[0] = 0;
    }
    else {
      stringLoc[0] -= 2
    }

    var relevantString = value.slice(stringLoc[0], stringLoc[1]).replace(/\s+$/,""),
      matches = relevantString.match(/(^|\s)@(.+)/);

    if (matches) {
      return matches[2];
    }
    else {
      return "";
    }
  };

  Mentions.prototype.findStringToReplace = function(value, cursorIndex) {
    var atLocation = value.lastIndexOf('@', cursorIndex);
    if (atLocation === -1) {
      return [0,0];
    }

    var nextAt = cursorIndex;

    if (nextAt == -1) {
      nextAt = value.length;
    }

    return [atLocation, nextAt];
  };

  Mentions.prototype.keyDownHandler = function(event) {
    var input = this._superClass.input.get(0),
      selectionStart = input[0].selectionStart,
      selectionEnd = input[0].selectionEnd,
      isDeletion = (event.keyCode == KEYCODES.DEL && selectionStart < input.val().length) || (event.keyCode == KEYCODES.BACKSPACE && (selectionStart > 0 || selectionStart != selectionEnd)),
      isInsertion = (KEYCODES.isInsertion(event.keyCode) && event.keyCode != KEYCODES.RETURN);

    if (isDeletion) {
      this.deletionAt(selectionStart, selectionEnd, event.keyCode);
    }
    else if (isInsertion) {
     this.insertionAt(selectionStart, selectionEnd, event.keyCode);
    }
  };

  Mentions.prototype.insertionAt = function(insertionStartIndex, selectionEnd) {
    if(insertionStartIndex != selectionEnd){
      this.selectionDeleted(insertionStartIndex, selectionEnd);
    }
    this.updateMentionLocations(insertionStartIndex, 1);
    this.destroyMentionAt(insertionStartIndex);
  };

  Mentions.prototype.deletionAt = function(selectionStart, selectionEnd, keyCode) {
    if(selectionStart != selectionEnd){
      this.selectionDeleted(selectionStart, selectionEnd);
      return;
    }

    var effectiveCursorIndex;
    if(keyCode == KEYCODES.DEL){
      effectiveCursorIndex = selectionStart;
    }
    else {
      effectiveCursorIndex = selectionStart - 1;
    }

    this.updateMentionLocations(effectiveCursorIndex, -1);
    this.destroyMentionAt(effectiveCursorIndex);
  };

  Mentions.prototype.selectionDeleted = function(selectionStart, selectionEnd) {
    this.destroyMentionsWithin(selectionStart, selectionEnd);
    this.updateMentionLocations(selectionStart, selectionStart - selectionEnd);
  };

  Mentions.prototype.destroyMentionsWithin = function(start, end) {
    $,each(this.mentions, function(index, mention) {
      if(start < mention.visibleEnd && end >= mention.visibleStart) {
        this.mentions.splice(index, 1);
      }
    });
  };

  Mentions.prototype.destroyMentionAt = function(effectiveCursorIndex) {
    var mentionIndex = this.mentionAt(effectiveCursorIndex),
      mention = this.mentions[mentionIndex];

    if (mention) {
     this.mentions.splice(mentionIndex, 1);
    }

  };

  Mentions.prototype.updateMentionLocations = function(effectiveCursorIndex, offset) {
    var changedMentions = this.mentionsAfter(effectiveCursorIndex);

    $.each(changedMentions, function(index, mention) {
      mention.visibleStart += offset;
      mention.visibleEnd += offset;
    });
  };

  Mentions.prototype.mentionAt = function(visibleCursorIndex) {
    var ret = false;
    $.each(this.mentions, function(index, mention) {
      if(visibleCursorIndex > mention.visibleStart && visibleCursorIndex < mention.visibleEnd){
        ret = i;
      }
    });
    return ret;
  };

  Mentions.prototype.mentionsAfter = function(visibleCursorIndex) {
    var resultMentions = [];
    $.each(this.mentions, function(index, mention) {
      if(visibleCursorIndex <= mention.visibleStart){
        resultMentions.push(mention);
      }
    });
  };

  Mentions.prototype.repopulateHiddenInput = function() {
    var newHiddenVal = this.generateHiddenInput(this._superClass.input.val());
    if(newHiddenVal != this._superClass.hiddenInput.val) {
      this._superClass.hiddenInput.val(newHiddenVal);
    }
  };

  Diaspora.widgets.add("publisher.mentions", Mentions);
})();