/*globals BrowserID: true */
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Mozilla BrowserID.
 *
 * The Initial Developer of the Original Code is Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2011
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */
(function() {
  "use strict";

  var bid = BrowserID,
      dom = bid.DOM,
      user = bid.User,
      errors = bid.Errors,
      tooltip = bid.Tooltip,
      validation = bid.Validation,
      helpers = bid.Helpers = bid.Helpers || {};

  function extend(target, source) {
    for(var key in source) {
      target[key] = source[key];
    }
  }

  function getAndValidateEmail(target) {
    var email = (dom.getInner(target) || "").trim();

    if(!validation.email(email)) return null;

    return email;
  }

  function getAndValidatePassword(target) {
    var password = (dom.getInner(target) || "");

    if(!validation.password(password)) return null;

    return password;
  }

  function toURL(base, params) {
    var url = base,
        getParams = [];

    for(var key in params) {
      getParams.push(key + "=" + encodeURIComponent(params[key]));
    }

    if(getParams.length) {
      url += "?" + getParams.join("&");
    }

    return url;
  }

  function relativeDate(date) {
    var diff = (((new Date()).getTime() - date.getTime()) / 1000),
        day_diff = Math.floor(diff / 86400),
        dObj = { "friendly" : date.toLocaleDateString(),
                "additional" : date.toLocaleTimeString(),
                "utc" : date.toUTCString(),
                "locale" : date.toLocaleString() };

    /* some kind of error */
    if (day_diff < 0) {
        dObj.friendly = "in the future!?!";
        return dObj;
    } else if (isNaN(day_diff)) {
        dObj.friendly = dObj.additional = "unknown";
        return dObj;
    }

    if (day_diff === 0) {
        if (diff < 60) {
            dObj.friendly = "just now";
            return dObj;
        }
        if (diff < 120 + 30) { /* 1 minute plus some fuzz */
            dObj.friendly = "a minute ago";
            return dObj;
        }
        if (diff < 3600) {
            dObj.friendly = Math.floor(diff / 60) + " minutes ago";
            return dObj;
        }
        if (diff < (60 * 60) * 2) {
            dObj.friendly = "1 hour ago";
            return dObj;
        }
        if (diff < 24 * 60 * 60) {
            dObj.friendly = Math.floor(diff / 3600) + " hours ago";
            return dObj;
        }
    }
    if (day_diff === 1) {
        dObj.friendly = "yesterday";
        return dObj;
    }
    if (day_diff < 7) {
        dObj.friendly = day_diff + " days ago";
        return dObj;
    }
    if (day_diff < 8) {
        dObj.friendly = "last week";
        return dObj;
    }
    /* for this scope: we want day of week and the date
         plus the month (if different) */
    if (day_diff < 31) {
        dObj.friendly = Math.ceil(day_diff / 7) + " weeks ago";
        return dObj;
    }

    /* for this scope: we want month + date */
    if (day_diff < 62) {
        dObj.friendly = "a month ago";
        return dObj;
    }
    if (day_diff < 365) {
        dObj.friendly = Math.ceil(day_diff / 31) + " months ago";
        return dObj;
    }

    /* for this scope: we want month + year */
    if (day_diff >= 365 && day_diff < 730) {
        dObj.additional = date.toLocaleDateString();
        dObj.friendly = "a year ago";
        return dObj;
    }
    if (day_diff >= 365) {
        dObj.additional = date.toLocaleDateString();
        dObj.friendly = Math.ceil(day_diff / 365) + " years ago";
        return dObj;
    }
    return dObj;
  }


  extend(helpers, {
    /**
     * Extend an object with the properties of another object.  Overwrites
     * properties if they already exist.
     * @method extend
     * @param {object} target
     * @param {object} source
     */
    extend: extend,

    /**
     * Get an email from a DOM element and validate it.
     * @method getAndValidateEmail
     * @param {string} target - target containing the email
     * @return {string} email if email is valid, null otw.
     */
    getAndValidateEmail: getAndValidateEmail,

    /**
     * Get an password from a DOM element and validate it.
     * @method getAndValidatePassword
     * @param {string} target - target containing the password
     * @return {string} password if password is valid, null otw.
     */
    getAndValidatePassword: getAndValidatePassword,

    /**
     * Convert a base URL and an object to a URL with GET parameters.  All
     * keys/values are converted as <key>=encodeURIComponent(<value>)
     * method @toURL
     * @param {string} base_url - base url
     * @param {object} [params] - object to convert to GET parameters.
     * @returns {string}
     */
    toURL: toURL,

    /**
     * Get the date relative to now.
     * @method relativeDate
     * @param {Date} date
     * @returns {string} date relative to now.
     */
    relativeDate: relativeDate

  });


}());

