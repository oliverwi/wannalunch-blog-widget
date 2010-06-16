if (typeof Wannalunch == "undefined" || !Wannalunch) {
    var Wannalunch = {};
}

(function() {
    
    var wlHost = 'http://simple-meadow-22.heroku.com',
        wlCreateLunchUrl = 'http://wannalunch.com',
        wlCssLoaded = false,
        wlCssHref = '../src/wannalunch.css';
    
    Wannalunch.Widget = function(options) {
        this._options = options;
    
        // TODO: widget must have unique id here
        this._containerElId = 'wl_widget'
    }
    
    Wannalunch.Widget.prototype = {
        
        _setData: function(data) {
            this._data = data;
        },
        
        _getDataUrl: function() {
            return wlHost + '/lunch/info/' + this._options['lunch'] + '?wannas=true&lunchers=true&callback=?';
        },
        
        _getJoinUrl: function() {
            return 'http://wannalunch.com/lunch/show/' + this._options['lunch'];
        },
        
        _getAuthorImage: function() {
            if (this._data) {
                return 'http://wannalunch.com' + this._data.creator.img;
            } else {
                // TODO: display default profile photo placer
                return '';
            }
        },
        
        _writeHtml: function() {
            if (this._data) {
                var html = '';
                html += '<div class="wannalunch_widget_header">';
                html += '<div class="wannalunch_widget_header_logo"></div>';
                html += '<div class="wannalunch_widget_header_left">Lunch host</div>';
                html += '<div class="wannalunch_widget_header_right">Join me in the discussion:</div>';
                html += '</div>'; // widget_header
                html += '<div class="wannalunch_widget_inner">'
                html += '<div class="wannalunch_widget_left">';
                html += '<img src="' + this._getAuthorImage() + '" alt="' + this._data.creator.name + '" width="50" height="50" class="wannalunch_widget_host_photo" />';
                html += '<div class="wannalunch_widget_host_info">';
                html += '<b>' + this._data.creator.name + '</b><br/>';
                html += '</div>';
                if (this._data.wannas.length > 0) {
                    html += '<div class="wannalunch_widget_wannas"><div class="wannalunch_widget_wannas_header">Going</div>';
                    html += '<div class="wannalunch_widget_wannas_imgs">';
                    for (var i = 0, l = this._data.wannas.length; i < Math.min(l, 3); i++) {
                        html += '<img src="' + this._data.wannas[i].img + '" alt="' + this._data.wannas[i].name + '" />';
                    }
                    html += '</div>';
                    html += '<div class="wannalunch_widget_wannas_info">';
                    if (this._data.wannas.length > 3) {
                        html += '+ ' + (this._data.wannas.length - 3) + ' more';
                    }
                    html += '</div>';
                    html += '</div>';
                }
                html += '<div class="wannalunch_widget_logo"></div>';
                html += '</div>'; // widget_left

                html += '<div class="wannalunch_widget_right">';
                html += '<p>' + this._data.desc + '</p>';
                html += '<p>@' + this._data.place + ' &ndash; ' + this._data.city + ' &ndash; ' + this._data.date + ' &ndash; ' + this._data.time + '</p>';
                html += '<div class="wannalunch_widget_actions">';
                html += '<a href="' + this._getJoinUrl() + '" class="wannalunch_widget_action_join" target="blank">Join Lunch!</a>';
                html += '<a href="' + wlCreateLunchUrl + '" class="wannalunch_widget_action_sub" target="blank">Create my own</a>';
                html += '</div>';
                html += '</div>';
                html += '</div>'; // widget_inner
                document.getElementById(this._containerElId).innerHTML = html;
            }
        },
        
        display: function() {
            Wannalunch.Widget.importCSS();
            
            document.write('<div id="' + this._containerElId + '" class="wannalunch_widget_container"></div>');
    
            var self = this;
            $.getJSON(this._getDataUrl(), function(data) {
                self._setData(data);
                self._writeHtml();
            });
        }
    };
    
    Wannalunch.Widget.importCSS = function() {
        if (!wlCssLoaded) {
            var s = document.createElement('link'); s.rel = 'stylesheet'; s.type = 'text/css'; s.media = 'screen';
            s.href = wlCssHref;
    
            var head = document.getElementsByTagName('head')[0];
            if (head) {
                head.appendChild(s);
            } else {
                document.body.appendChild(s);
            }
        }
    };
    
    Wannalunch.Widget.display = function(options) {
        var widget = new Wannalunch.Widget(options);
        widget.display();
    }
}());