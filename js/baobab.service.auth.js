(function() {
  require(["angular"], function(angular) {
    return angular.module('baobab.service.auth', []).service('$auth', [
      '$cookieStore', '$location', '$inbox', function($cookieStore, $location, $inbox) {
        this.clearToken = (function(_this) {
          return function() {
            $cookieStore.remove('inbox_auth_token');
            return window.location = '/';
          };
        })(this);
        this.readTokenFromCookie = (function(_this) {
          return function() {
            var e;
            try {
              _this.token = $cookieStore.get('inbox_auth_token');
            } catch (_error) {
              e = _error;
              _this.clearToken();
            }
            return !!_this.token;
          };
        })(this);
        this.readTokenFromURL = (function(_this) {
          return function() {
            var search, token, tokenEnd, tokenStart;
            search = window.location.search;
            tokenStart = search.indexOf('access_token=');
            if (tokenStart === -1) {
              return;
            }
            tokenStart += 'access_token='.length;
            tokenEnd = search.indexOf('&', tokenStart);
            if (tokenEnd === -1) {
              tokenEnd = search.length - tokenStart;
            }
            token = search.substr(tokenStart, tokenEnd);
            $cookieStore.put('inbox_auth_token', token);
            return window.location.href = '/';
          };
        })(this);
        if (!this.readTokenFromCookie()) {
          this.readTokenFromURL();
        }
        if (this.token) {
          $inbox.withCredentials(true);
          $inbox.setRequestHeader('Authorization', 'Basic ' + btoa(this.token + ':'));
        }
        return this;
      }
    ]);
  });

}).call(this);