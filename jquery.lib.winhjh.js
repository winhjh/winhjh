/**
 * @author Ji hyung Heo
 * @updated  2013-07-19aaaaaaaaaaaaaaaaaaaaaaaaaaa
 */
(function($)
{
	/**
	 * $('<UL>').dataList({param});
	 */
	$.fn.dataList = function(options)
	{
		var $container = $(this);
		var $items = $container.children();
		var $box = $('<div />');
		var defaultOpts =
		{
			'height' : '300px',
			'border' : '1px #999 solid',
			'bgcolor' : 'rgba(180, 180, 180, 0.7)',
			'linkObj' : null,
			'selectedCSS' :
			{
				'background-color' : '#fff',
				'font-weight' : 'bold',
				'border' : '2px #ff5 dotted',
				'list-style-type' : 'none',
				'padding' : '5px',
				'margin' : '0px'
			},
			'commonCSS' :
			{
				'background-color' : 'inherit',
				'font-weight' : 'normal',
				'border' : '1px #aaa solid',
				'list-style-type' : 'none',
				'padding' : '5px',
				'margin' : '0px'
			},
			'callback' : function(data) {}
		};
		
		var opts = $.extend(defaultOpts, options);
		
		$('#dataList_box').remove();
		
		$box.attr('id', 'dataList_box')
			.css(
			{
				'position' : 'absolute',
				'margin' : '0px',
				'padding' : '0px',
				'z-index' : '3000',
				'overflow-y' : 'scroll',
				'left' : $(opts.linkObj).offset().left,
				'top' : $(opts.linkObj).offset().top + $(opts.linkObj).height(),
				'width' : $(opts.linkObj).outerWidth(),
				'height' : opts.height,
				'background-color' : opts.bgcolor,
				'border' : opts.border
			})
			.append($container)
			.appendTo('body');
		
		$container
			.css('margin', '0px')
			.css('padding', '0px')
			.bind('evtSelectedChange', function(e, param)
			{
				$items
					.css(opts.commonCSS)
					.attr('sel', 0);
				
				if(param == undefined)
				{
					$items
						.filter(':first')
						.css(opts.selectedCSS)
						.attr('sel', 1);
				}
				else
				{
					$(param.obj)
						.css(opts.selectedCSS)
						.attr('sel', 1);
				}
			})
			.bind('evtSelectedCallback', function(e, param)
			{
				opts.callback(param);
				$box.remove();
			});
		
		$container.trigger('evtSelectedChange');
		
		$items
			.click(function(e)
			{
				$container.trigger('evtSelectedChange', {'obj' : $(this), 'event' : e});
			})
			.dblclick(function(e)
			{
				$container.trigger('evtSelectedCallback', {'obj' : $(this), 'event' : e});
			});
		
		$(opts.linkObj)
			.keyup(function(e)
			{
				var $current = $items.filter('[sel="1"]');
				
				switch(e.which)
				{
					case 38: //Up
						if ($current.prev().length < 1) {
							var $obj = $current.siblings(':last');
						} else {
							var $obj = $current.prev();
						}
						
						$container.trigger('evtSelectedChange', {'obj' : $obj});
						break;
						
					case 40: //Down
						if ($current.next().length < 1) {
							var $obj = $current.siblings(':first');
						} else {
							var $obj = $current.next();
						}
						
						$container.trigger('evtSelectedChange', {'obj' : $obj});
						break;
						
					case 13: //Enter
						$container.trigger('evtSelectedCallback', {'obj' : $current, 'event' : e});
						break;
						
					case 27: //Esc
						$box.remove();
						break;
				}
			});
	};
	
	/**
	 * jQuery scroll box
	 * @param options
	 * {
	 *  width,
	 *  border,
	 *  bgcolor
	 * }
	 * @return [jQuery Object] selector 
	 */
	$.fn.scrollbox = function(options)
	{
		var $container = $(this);
		var $items = $container.children();
		var $box = $('<div />');
		var $scrollbar = $('<div />');
		var defaultOpts =
		{
			'width' : 8, 
			'border' : '1px #999 solid',
			'bgcolor' : 'rgba(180, 180, 180, 0.7)'
		};
		
		var opts = $.extend(defaultOpts, options);
		
		$box.attr('id', 'box')
			.css('position', 'absolute')
			.css('margin', '0px')
			.css('padding', '0px')
			.css('left', '0px')
			.css('top', '0px')
			.appendTo($container)
			.append($items);
		
		var scrollbar_height = $container.height() - 10;
		scrollbar_height = scrollbar_height * scrollbar_height / $box.outerHeight(); 
		
		$scrollbar
			.css('position', 'absolute')
			.css('margin', '5px')
			.css('border', opts.border)
			.css('right', '0px')
			.css('top', '0px')
			.css('-webkit-border-radius', '5px')
			.css('background-color', opts.bgcolor)
			.width(opts.width)
			.height(scrollbar_height)
			.hide()
			.appendTo($container);
		
		$container
			.css('position', 'relative')
			.css('overflow', 'hidden')
			.hover(function()
			{
				$scrollbar.fadeIn(500);
			},
			function()
			{
				$scrollbar.fadeOut(500);
			})
			.mousewheel(function(e, delta)
			{
				var v = $box.offset().top + delta * 30;
				var topLimit = -($box.height() - $container.height());
				
				if(v > 0)
				{
					v = 0;
				}
				else if(v < topLimit)
				{
					v = topLimit;
				}
				
				$box.css('top', v);
				$scrollbar.css('top', v / topLimit * ($container.height() - 10 - scrollbar_height));
				e.stopPropagation();
				e.preventDefault();
			});
		
		return $container;
	};
	
	/**
	 * jQuery file download
	 * @param options
	 * {
	 *  method : 'get',
	 *  url : '',
	 *  inputname : 'param',
	 *  jsondata : ''
	 * }
	 * @return null
	 */
	$.download = function(options)
	{
		var defaults = 
		{
			method : 'get',
			url : '',
			inputname : 'param',
			jsondata : ''
		};
		
		var opts = $.extend(defaults, options);

		var $input = $('<input />');
		$input
			.attr('type', 'hidden')
			.attr('name', opts.inputname)
			.val(opts.jsondata);

		$('<form />')
			.appendTo('body')
			.attr('method', opts.method)
			.attr('action', opts.url)
			.append($input)
			.submit()
			.remove();
	};
	
	$.fillBackground = function(options)
	{
		var defaults =
		{
			bgcolor : '#000',
			target : 'body'
		};
		
		var opts = $.extend(defaults, options);
		
		if($(opts.target).height() < $(window).height())
		{
			$_background = $('<div />');
			$_background
				.css(
				{
					'position' : 'absolute',
					'width' : '100%',
					'height' : ($(window).height() - $(opts.target).height()) + 'px',
					'background-color' : opts.bgcolor,
					'z-index' : '-999'
				})
				.resize(function()
				{
					$(this)
						.css('height', ($(window).height() - $(opts.target).height()) + 'px');
				})
				.insertAfter(opts.target);
		}
	};
	
	/**
	 * jQuery delay2(sec, callback)
	 * @param sec seconds
	 * @param callback
	 * @return this
	 */
	$.fn.delay2 = function(sec, callback)
	{
		var duration = sec * 1000;
		
		if(typeof(callback) == 'function')
		{
			$(this).animate({opacity:'+=0'}, duration, callback);
			return this;
		}
		else
		{
			$(this).animate({opacity:'+=0'}, duration);
			return this;
		}
	};

	/**
	 * jQuery tick(sec, count, tickcall, callback)
	 * @param sec
	 * @param count
	 * @param tickcall
	 * @param callback
	 * @return null
	 */
	$.tick = function(sec, count, tickcall, callback)
	{
		var _selfcall = function(count)
		{
			$(this).delay2(sec, function()
			{
				if(count > 0)
				{
					tickcall();
					_selfcall(--count);
				}
				else if(count == 0)
				{
					callback();
				}
				
				return;
			});
		};
		
		_selfcall(count);
	};
	
	$.fn.textLink = function(linkurl, queryMap, prefix)
	{
		prefix = (prefix == null) ? '?' : prefix;
		
		$(this)
			.css('cursor', 'pointer')
			.hover(function()
			{
				$(this)
					.css('text-decoration', 'underline');
			}, function()
			{
				$(this)
					.css('text-decoration', 'none');
			})
			.click(function()
			{
				var $_this = $(this);
				var paraMap = {};
				
				$.each(queryMap, function(k, v)
				{
					if(v == '[%textNode%]')
					{
						paraMap[k] = $_this.text();
					}
					else if(v == '[%itemprop%]')
					{
						paraMap[k] = $_this.attr('itemprop');
					}
					else
					{
						paraMap[k] = v;
					}
				});

				location.href = linkurl + prefix + $.param(paraMap);
			});
	};
	
	$.fn.textNode = function(textnode)
	{
		if($.type(textnode) == 'string')
		{
			return $(this)
				.html(function()
				{
					return textnode + $(this)
						.contents()
						.filter(function()
						{
							return this.nodeType != 3;
						})
						.wrap('<textNode></textNode>')
						.parent()
						.html();
				});
		}
		else if($.type(textnode) == 'null')
		{
			return $(this)
				.contents()
				.filter(function()
				{
					return this.nodeType == 3;
				});
		}
	};
	
	$.setCookie = function(key, val, expireDate)
	{
		var _expireDate = new Date(expireDate);
		document.cookie = key + "=" + escape(val) + '; expires=' + _expireDate.toUTCString();
	};
	
	$.getCookie = function(key)
	{
		var cookies = document.cookie.split(';');
		for(cookieItem in cookies.length)
		{
			var _key = cookieItem.substr(0, cookieItem.indexOf('='));
			var _val = cookieItem.substr(cookieItem.indexOf('=') + 1);
			
			if(_key.replace(/^\s+|\s+$/g, '') == key)
			{
				return unescape(_val);
			}
		}
		
		return false;
	};
	
	$.localStorage = 
	{
		'set' : function(key, val, expireDate)
		{
			if($.type(Storage) !== 'undefined')
				localStorage.setItem(key, val);
			else
				$.setCookie(key, val, expireDate);
		},
		'get' : function(key)
		{
			if($.type(Storage) !== 'undefined')
				return localStorage.getItem(key);
			else
				return $.getCookie(key);
		},
		'remove' : function(key)
		{
			if($.type(Storage) !== 'undefined')
				localStorage.removeItem(key);
			else
				$.setCookie(key, '', $.now() - 1);
		},
		'length' : function()
		{
			if($.type(Storage) !== 'undefined')
				return localStorage.length;
			else
				return document.cookie.split(';').length;
		}
	};
	
	$.fn.ridiTooltip = function(options, animationOptions)
	{
		var $_this = $(this);
		var defaults =
		{
			'id' : '0',
			'src' : '',
			'bg_src' : '',
			'retinaSize' : true,
			'html' : '',
			'css' : {},
			'position' : 'absolute',
			'adjustLeft' : 0,
			'adjustTop' : 0,
			'adjustRotate' : 0,
			'cont_adjustLeft' : 0,
			'cont_adjustTop' : 0,
			'zIndex' : 10,
			'animation' : false,
			'expireDate' : '9999-12-31 23:59:59'
		};
		
		var defaultAnimationOpts =
		{
			'pong' :
			{
				'boundingPixel' : 7,
				'loop' : true
			}
		};
		
		var onAnimating = false;
		var animatingVar = {};
		
		var opts = $.extend(defaults, options);
		if(opts.animation !== false)
		{
			var animationOpts = $.extend(defaultAnimationOpts[opts.animation], animationOptions);
		}
		
		if($.now() > Date.parse(opts.expireDate))
		{
			$.localStorage.remove('tooltip_' + opts.id)
			return;
		}
		
		if($.localStorage.get('tooltip_' + opts.id) != null)
			return;
		
		$tooltip = $('<div/>');
		$tooltip
			.attr('id', 'tooltip_' + opts.id)
			.on('refresh', function()
			{
				var $tootip_cont = $(this).find('img:last');
				var childWidth = $tootip_cont.width() + $tootip_cont.position().left;
				var left = ($_this.width() - childWidth) / 2 + $_this.offset().left;
				var top = $_this.offset().top - $(this).height();
				
				if(left + childWidth > $(window).width())
					left = $(window).width() - childWidth;
				
				$(this)
					.css(
					{
						'position' : opts.position,
						'display' : 'block',
						'width' : childWidth,
						'height' : $(this).height(),
						'left' : left + opts.adjustLeft,
						'top' : top + opts.adjustTop,
						'z-index' : opts.zIndex,
						'text-align' : 'left'
					})
					.css(opts.css);
				
				if(onAnimating)
					return;
				
				if(opts.animation == 'pong')
				{
					onAnimating = true;
					animatingVar.boundingPixel = animationOpts.boundingPixel;
					$(this).trigger('animate_pong');
				}
			})
			.on('animate_pong', function(e)
			{
				$(this)
					.animate({top : '+=' + animatingVar.boundingPixel + 'px'}, 300)
					.animate({top : '-=' + animatingVar.boundingPixel + 'px'}, 400, function()
					{
						if(animationOpts.loop || --animatingVar.boundingPixel > 0)
						{
							$(this).trigger('animate_pong');
						}
						else
						{
							animatingVar.boundingPixel = animationOpts.boundingPixel;
							onAnimating = false;
						}
					});
			})
			.append(function()
			{
				if(opts.src == '' && opts.bg_src == '')
				{
					return $('<span/>').html(opts.html);
				}
				else
				{
					return $('<img/>')
						.attr('src', opts.bg_src)
						.load(function()
						{
							var $tooltip_bg = $(this);
							$tooltip_bg
								.css(
								{
									'width' : (opts.retinaSize) ? Math.round($(this).width() / 2) : $(this).width(),
									'height' : (opts.retinaSize) ? Math.round($(this).height() / 2) : $(this).height(),
									'transform' : 'rotate(' + opts.adjustRotate + 'deg)',
									'z-index' : 1
								})
								.after(function()
								{
									return $('<img/>')
										.attr('src', opts.src)
										.load(function()
										{
											$(this)
												.css(
												{
													'position' : 'absolute',
													'width' : (opts.retinaSize) ? Math.round($(this).width() / 2) : $(this).width(),
													'height' : (opts.retinaSize) ? Math.round($(this).height() / 2) : $(this).height(),
													'top' : 0,
													'left' : 0,
													'z-index' : 2
												})
												.css(
												{
													'top' : Math.round($tooltip_bg.height() / 2 - $(this).height() / 2 + opts.cont_adjustTop),
													'left' : Math.round($tooltip_bg.width() / 2 - $(this).width() / 2 + opts.cont_adjustLeft)
												});
											
											$tooltip.trigger('refresh');
										});
								});
						});
				}
			})
			.click(function()
			{
				$.localStorage.set('tooltip_' + opts.id, true);
				$(this).hide();
			})
			.appendTo('body');
			
		if(opts.src == '')
		{
			$tooltip.trigger('refresh');
		}
			
		$(window)
			.bind('resize', function()
			{
				$tooltip.trigger('refresh');
			});
	};
	
	$.fn.viewImages = function(options)
	{
		var $imgs = $(this);
		var defaults =
		{
			'container_id' : 'viewImages',
			'index' : 0,
			'border_width' : 0,
			'left_border_width' : 0
		};
		var opts = $.extend(defaults, options);
		var getOrgSrc = function(img)
		{
			var org_src = $(img).attr('org_src');
			if (org_src == null) {
				org_src = $(img).attr('src');
			}
			return org_src;
		};
		
		var $img_list = $imgs.clone();
		$imgs
			.on('click', function(e)
			{
				var $this = $(this);
				var map = {};
				$img_list.each(function(i, img)
				{
					if (getOrgSrc($this) == getOrgSrc(img)) {
						map = {
							'img' : img,
							'idx' : $img_list.index(img)
						};
						idx = $img_list.index(img);
					}
				});
				
				$('#' + opts.container_id)
					.css('visibility', 'visible')
					.trigger('evtShow', map);
			});
			
		$img_list
			.each(function(i, img)
			{
				$img_list.each(function(j, img2)
				{
					if(i != j && getOrgSrc(img) == getOrgSrc(img2)) {
						$img_list.splice($.inArray(img, $img_list), 1);
					}
				});
			})
			.on('click', function(e)
			{
				var map = {
					'img' : this,
					'idx' : $img_list.index(this)
				};
				$('#' + opts.container_id).trigger('evtShow', map);
			})
			.eq(0)
			.on('load', function(e)
			{
				if (opts.border_width == 0) {
					opts.border_width = $(this).outerWidth() - $(this).innerWidth();
				}
				
				if (opts.border_width > 1) {
					opts.left_border_width = opts.border_width / 2;
				}
				
				var img_list_width = $(this).outerWidth(true) * $img_list.length + opts.border_width;
				$('#' + opts.container_id + ' .imgList').width(img_list_width);
			});
		
		$('#' + opts.container_id)
			.on('evtShow', function(e, param)
			{
				var org_src = getOrgSrc(param.img);
				var title = $(param.img).data('title');
				if (title == null) {
					title = $(param.img).attr('alt');
				}
				
				opts.index = param.idx;
				
				$(this)
					.find('.imgTitle')
					.html(title)
					.end()
					.find('.curImg')
					.attr('src', org_src)
					.end()
					.show()
					.find('.imgList')
					.trigger('evtCenter');
			})
			.on('click', '.btnPrev', function(e)
			{
				var $prev = $img_list.eq(opts.index).prev();
				if ($prev.length < 1) {
					$prev = $img_list.last();
				}
				$(this).trigger('evtShow',  {
					'img' : $prev,
					'idx' : $img_list.index($prev)
				});
			})
			.on('click', '.btnNext', function(e)
			{
				var $next = $img_list.eq(opts.index).next();
				if ($next.length < 1) {
					$next = $img_list.first();
				}
				$(this).trigger('evtShow', {
					'img' : $next,
					'idx' : $img_list.index($next)
				});
			})
			.on('click', '.btnClose', function(e)
			{
				$('#' + opts.container_id).hide();
			})
			.find('.imgList')
			.on('evtCenter', function(e)
			{
				var $img = $img_list.eq(opts.index);
				var prev_items_width = $img.outerWidth(true) * opts.index;
				var left = -prev_items_width + $('#' + opts.container_id).width() / 2 - $img.outerWidth(true) / 2 - opts.left_border_width;
				$(this)
					.css('left', left)
					.find('img.sel')
					.removeClass('sel')
					.end()
					.find('img:eq(' + opts.index + ')')
					.addClass('sel')
			})
			.append($img_list)
			.find('img:eq(0)')
			.addClass('sel');
	};
	
	$.fn.StickySwipe = function(options)
	{
		var $_this = $(this);
		var defaults =
		{
			'index' : 0,
			'containerLeft' : 0,
			'DeviceOrientationTime' : 700,
			'animateTime' : 300,
			'tiltDegree' : 35,
			'initEvent' : function(){},
			'startEvent' : function(){},
			'stopEvent' : function(){},
			'onTilt' : false,
			'onLoop' : false,
			'onReflection' : false,
			'onCenter' : false
		};
		
		var DeviceOrientationTimerID = null;
		
		var opts = $.extend(defaults, options);
		var $parent = $_this.parent();
		var $container = null;
		
		var realitemWidth = $_this
			.find('li:first')
			.width();
			
		var itemWidth = $_this
			.find('li:first')
			.outerWidth(true);
		
		var itemLength = $_this.find('li').length;
		
		var containerLeft = 0;
		var containerWidth = itemLength * itemWidth;
		var D = null;
		var ItemLeft = null;
		var index = opts.index;

		if($_this.get(0).tagName == 'UL')
		{
			var $_prevthis = $_this.prev();
			
			$container = $('<div/>');
			$container
				.css('width', containerWidth)
				.wrapInner($_this)

			if($_prevthis.length == 0)
			{
				$container.appendTo($parent);
			}
			else
			{
				$container.insertAfter($_prevthis);
			}
		}
		else
		{
			$container = $_this;
		}
		
		$_this
			.css(
			{
				'backface-visibility' : 'hidden',
				'transform' : 'translateZ(1px)'
			})
			.find('li')
			.width(realitemWidth)
			.css(
			{
				'backface-visibility' : 'hidden',
				'transform' : 'translateZ(1px)',
				'transition' : 'all ' + opts.animateTime +'ms ease-in-out'
			});
		
		var callbackParam = function() 
		{
			var _param =
			{
				'data' : $_this.find('li').eq(index).data(),
				'idx' : index,
				'item' : $_this.find('li').eq(index),
				'items' : $_this.find('li'),
				'container' : $container
			};
			
			return _param;
		};
		
		$parent
			.bind('refresh', function(e, param)
			{
				if(opts.onCenter)
				{
					containerLeft = ($parent.outerWidth() / 2) - (itemWidth / 2);
				}
				else
				{
					containerLeft = opts.containerLeft;
				}
				
				itemLength = $_this.find('li').length;
				ItemLeft = new classIndicator(itemWidth, containerLeft, itemLength);
				
				if($.type(param) == 'undefined')
				{
					D = new classDistance(containerLeft);
				}
				
				D.setLastPosition(ItemLeft.itemLeft[index].left);

				$container
					.css(
					{
						'position' : 'absolute',
						'backface-visibility' : 'hidden',
						'transition' : 'all ' + opts.animateTime +'ms ease-in-out',
						'transform' : 'translate3d(' + ItemLeft.itemLeft[index].left + 'px, 0px, 1px)'
					});
			})
			.bind('move', function(e, animateLeft)
			{
				$container
					.css(
					{
						'transition' : 'all ' + opts.animateTime +'ms ease-in-out',
						'transform' : 'translate3d(' + animateLeft + 'px, 0px, 1px)'
					});
					
				D.setLastPosition(animateLeft);
				opts.stopEvent(callbackParam());
			})
			.bind('movePrev', function(e, param)
			{
				if(index > 0)
				{
					opts.startEvent(callbackParam());
					
					$(this)
						.trigger('move', ItemLeft.itemLeft[--index].left);
				}
				else if(param != null && param.loop)
				{
					opts.startEvent(callbackParam());
					
					$(this)
						.trigger('move', ItemLeft.itemLeft[index = itemLength - 1].left);
				}
			})
			.bind('moveNext', function(e, param)
			{
				if(index < itemLength - 1)
				{
					opts.startEvent(callbackParam());
					
					$(this)
						.trigger('move', ItemLeft.itemLeft[++index].left);
				}
				else if(param != null && param.loop)
				{
					opts.startEvent(callbackParam());
					
					$(this)
						.trigger('move', ItemLeft.itemLeft[index = 0].left);
				}
			})
			.bind('swipestart', function(e, paraE)
			{
				D.setStartPoint(paraE.pageX, paraE.pageY);
				D.setEndPoint(paraE.pageX, paraE.pageY);
				opts.startEvent(callbackParam());
			})
			.bind('swipemove', function(e, paraE)
			{
				if(D.onDistance)
				{
					$container
						.css(
						{
							'transition' : 'all 0s linear',
							'transform' : 'translate3d(' + D.getPosition().x + 'px, 0px, 1px)'
						});
				}
			})
			.bind('swipeend', function(e, paraE)
			{
				if(D.onDistance)
				{
					//가까운 아이템 위치
					var closestItem = ItemLeft.getPage(D.getPosition().x);
					
					index = closestItem.idx;
					
					$(this)
						.trigger('move', closestItem.left);
					
					D.onDistance = false;
				}
			})
			.bind('touchstart', function(e)
			{
				e = $.extend(e,
				{
					'pageX' : e.originalEvent.targetTouches[0].pageX,
					'pageY' : e.originalEvent.targetTouches[0].pageY
				});
				
				$(this)
					.trigger('swipestart', e);
			})
			.bind('touchmove', function(e)
			{
				D.setEndPoint(e.originalEvent.targetTouches[0].pageX, e.originalEvent.targetTouches[0].pageY);

				if((D.getDistance().x > D.getDistance().y) || D.onDistance)
				{  
					e.preventDefault();
					e = $.extend(e,
					{
						'pageX' : e.originalEvent.targetTouches[0].pageX,
						'pageY' : e.originalEvent.targetTouches[0].pageY
					});
	  				
					D.onDistance = true;
	  				
					$(this)
						.trigger('swipemove', e);
				}
				else
				{
					D.onDistance = false;
				}
			})
			.bind('touchend', function(e)
			{
				e = $.extend(e,
				{
					'pageX' : e.originalEvent.pageX,
					'pageY' : e.originalEvent.pageY
				});
  				
				$(this)
					.trigger('swipeend', e);	
			})
			.trigger('refresh');
		
		$(window)
			.bind('resize', function()
			{
				$parent.trigger('refresh', new Object());
			})
			.bind('orientationchange', function(e)
			{
				$parent.trigger('refresh', new Object());
			})
			.bind('deviceorientation', function(e)
			{
				//alert('beta : ' + e.originalEvent.beta); // X, tilt
				//alert('gamma : ' + e.originalEvent.gamma); //Y, roll
				//alert('alpha : ' + e.originalEvent.alpha); //Z, rotate
				if(opts.onTilt && DeviceOrientationTimerID == null)
				{
					var doZ = e.originalEvent.alpha;
				
					switch(Math.abs(window.orientation))
					{
						case 0:
							var doX = e.originalEvent.beta;
							var doY = e.originalEvent.gamma;
							break;
							
						case 90:
							var doX = e.originalEvent.gamma;
							var doY = e.originalEvent.beta;
							break;
					}
					
					if(doY > opts.tiltDegree)
					{
						DeviceOrientationTimerID = setTimeout(function()
						{
							clearTimeout(DeviceOrientationTimerID);
							DeviceOrientationTimerID = null;
						}, opts.DeviceOrientationTime);
						
						$parent
							.trigger('movePrev');
					}
					else if(doY < -opts.tiltDegree)
					{
						DeviceOrientationTimerID = setTimeout(function()
						{
							clearTimeout(DeviceOrientationTimerID);
							DeviceOrientationTimerID = null;
						}, opts.DeviceOrientationTime);
						
						$parent
							.trigger('moveNext');
					}
				}
			});

		opts.initEvent(callbackParam());
			
		return $_this;
	};

	$.fn.SimpleSwipe = function(options)
	{
		var $_this = $(this);
		var defaults =
		{
			'index' : 0,
			'movement' : 1,
			'containerLeft' : 0,
			'animateTime' : 300,
			'initEvent' : function(){},
			'startEvent' : function(){},
			'stopEvent' : function(){},
			'nextEvent' : function(){},
			'prevEvent' : function(){},
			'onLoop' : false,
			'onReflection' : false,
			'onCenter' : false
		};
		
		var opts = $.extend(defaults, options);
		var $parent = $_this.parent();
		var $container = null;
		
		var realitemWidth = $_this
			.find('li:first')
			.width();
			
		var itemWidth = $_this
			.find('li:first')
			.outerWidth(true);
		
		var itemLength = $_this.find('li').length;
		
		var containerLeft = 0;
		var containerWidth = itemLength * itemWidth;
		var D = null;
		var ItemLeft = null;
		var index = opts.index;

		if($_this.get(0).tagName == 'UL')
		{
			var $_prevthis = $_this.prev();
			
			$container = $('<div/>');
			$container
				.css('width', containerWidth)
				.wrapInner($_this)

			if($_prevthis.length == 0)
			{
				$container.appendTo($parent);
			}
			else
			{
				$container.insertAfter($_prevthis);
			}
		}
		else
		{
			$container = $_this;
		}
		
		$_this
			.css(
			{
				'backface-visibility' : 'hidden',
				'transform' : 'translateZ(1px)'
			})
			.find('li')
			.width(realitemWidth)
			.css(
			{
				'backface-visibility' : 'hidden',
				'transform' : 'translateZ(1px)',
				'transition' : 'all ' + opts.animateTime +'ms ease-in-out'
			});
		
		var callbackParam = function() 
		{
			var _param =
			{
				'data' : $_this.find('li').eq(index).data(),
				'idx' : index,
				'item' : $_this.find('li').eq(index),
				'items' : $_this.find('li'),
				'container' : $container
			};
			
			return _param;
		};
		
		$parent
			.bind('refresh', function(e, param)
			{
				if(opts.onCenter)
				{
					containerLeft = ($parent.outerWidth() / 2) - (itemWidth / 2);
				}
				else
				{
					containerLeft = opts.containerLeft;
				}
				
				itemLength = $_this.find('li').length;
				ItemLeft = new classIndicator(itemWidth, containerLeft, itemLength);
				
				if($.type(param) == 'undefined')
				{
					D = new classDistance(containerLeft);
				}
				
				D.setLastPosition(ItemLeft.itemLeft[index].left);

				$container
					.css(
					{
						'position' : 'absolute',
						'backface-visibility' : 'hidden',
						'transition' : 'all ' + opts.animateTime +'ms ease-in-out',
						'transform' : 'translate3d(' + ItemLeft.itemLeft[index].left + 'px, 0px, 1px)'
					});
			})
			.bind('move', function(e, animateLeft)
			{
				$container
					.css(
					{
						'transition' : 'all ' + opts.animateTime +'ms ease-in-out',
						'transform' : 'translate3d(' + animateLeft + 'px, 0px, 1px)'
					});
					
				D.setLastPosition(animateLeft);
				opts.stopEvent(callbackParam());
			})
			.bind('movePrev', function(e, param)
			{
				if(index > 0)
				{
					opts.startEvent(callbackParam());
					
					$(this)
						.trigger('move', ItemLeft.itemLeft[--index].left);
				}
				else if(param != null && param.loop)
				{
					opts.startEvent(callbackParam());
					
					$(this)
						.trigger('move', ItemLeft.itemLeft[index = itemLength - 1].left);
				}
			})
			.bind('moveNext', function(e, param)
			{
				if(index < itemLength - 1)
				{
					opts.startEvent(callbackParam());
					
					$(this)
						.trigger('move', ItemLeft.itemLeft[++index].left);
				}
				else if(param != null && param.loop)
				{
					opts.startEvent(callbackParam());
					
					$(this)
						.trigger('move', ItemLeft.itemLeft[index = 0].left);
				}
			})
			.bind('swipestart', function(e, paraE)
			{
				D.setStartPoint(paraE.pageX, paraE.pageY);
				D.setEndPoint(paraE.pageX, paraE.pageY);
				opts.startEvent(callbackParam());
			})
			.bind('swipemove', function(e, paraE)
			{
			})
			.bind('swipeend', function(e, paraE)
			{
				if(D.onDistance)
				{
					var animateLeft;
					var distance = D.getPosition().x - ItemLeft.itemLeft[index].left;
					
					if(distance > 50)
					{
						index -= opts.movement;
						opts.prevEvent(callbackParam());
					}
					else if(distance < -50)
					{
						index += opts.movement;
						opts.nextEvent(callbackParam());
					}
					
					if(opts.onLoop)
					{
						if(index < 0)
							index = ItemLeft.itemLeft.length - 1;
						else if(index >= ItemLeft.itemLeft.length)
							index = 0;
					}
					else
					{
						if(index < 0)
							index = 0;
						else if(index >= ItemLeft.itemLeft.length)
							index = ItemLeft.itemLeft.length - 1;
					}
					animateLeft = ItemLeft.itemLeft[index].left;
					
					$(this)
						.trigger('move', animateLeft);
					
					D.onDistance = false;
				}
			})
			.bind('touchstart', function(e)
			{
				e = $.extend(e,
				{
					'pageX' : e.originalEvent.targetTouches[0].pageX,
					'pageY' : e.originalEvent.targetTouches[0].pageY
				});
				
				$(this)
					.trigger('swipestart', e);
			})
			.bind('touchmove', function(e)
			{
				D.setEndPoint(e.originalEvent.targetTouches[0].pageX, e.originalEvent.targetTouches[0].pageY);

				if((D.getDistance().x > D.getDistance().y) || D.onDistance)
				{  
					e.preventDefault();
					e = $.extend(e,
					{
						'pageX' : e.originalEvent.targetTouches[0].pageX,
						'pageY' : e.originalEvent.targetTouches[0].pageY
					});
	  				
					D.onDistance = true;
	  				
					$(this)
						.trigger('swipemove', e);
				}
				else
				{
					D.onDistance = false;
				}
			})
			.bind('touchend', function(e)
			{
				e = $.extend(e,
				{
					'pageX' : e.originalEvent.pageX,
					'pageY' : e.originalEvent.pageY
				});
  				
				$(this)
					.trigger('swipeend', e);	
			})
			.trigger('refresh');
		
		$(window)
			.bind('resize', function()
			{
				$parent.trigger('refresh', new Object());
			})
			.bind('orientationchange', function()
			{
				$parent.trigger('refresh', new Object());
			});

		opts.initEvent(callbackParam());
			
		return $_this;
	};
	
})(jQuery);



var structPoint = function(x, y)
{
	this.x = (x != null) ? x : 0;
	this.y = (y != null) ? x : 0;
};

var classDistance = function(x, y)
{
	this.startPoint = new structPoint();
	this.endPoint = new structPoint();
	this.lastPoint = new structPoint(x, y);
	this.onDistance = false;
};

classDistance.prototype.setStartPoint = function(x, y)
{
	this.startPoint.x = x;
	this.startPoint.y = y;
};

classDistance.prototype.setEndPoint = function(x, y)
{
	this.endPoint.x = x;
	this.endPoint.y = y;
};

classDistance.prototype.getPosition = function()
{
	var x = this.lastPoint.x + this.endPoint.x - this.startPoint.x;
	var y = this.lastPoint.y + this.endPoint.y - this.startPoint.y;
	
	return {'x' : x, 'y' : y};
};

classDistance.prototype.setLastPosition = function(x, y)
{
	if(x != null)
	{
		this.lastPoint.x = x;
	}
	else
	{
		this.lastPoint.x += this.endPoint.x - this.startPoint.x;
	}
	
	if(y !=  null)
	{
		this.lastPoint.y = y;
	}
	else
	{
		this.lastPoint.y += this.endPoint.y - this.startPoint.y;
	}
	
	return {'x' : this.lastPoint.x, 'y' : this.lastPoint.y};
};

classDistance.prototype.getDistance = function()
{
	var x = Math.abs(this.endPoint.x - this.startPoint.x);
	var y = Math.abs(this.endPoint.y - this.startPoint.y);
	
	return {'x' : x, 'y' : y};
};

var structIndicatorItems = function()
{
	this.left = 0;
	this.distance = 0;
};

var classIndicator = function(itemWidth, containerLeft, itemCount)
{
	this.itemLeft = [];
			
	for(var i = 0; i < itemCount; i++)
	{
		this.itemLeft[i] = new structIndicatorItems();
		this.itemLeft[i].left = containerLeft - (itemWidth * i);
	}
};

classIndicator.prototype.getPage = function(containerLeft)
{
	var minDistance = 999999;
	var minIndex = -1;
	for(var i = 0; i < this.itemLeft.length; i++)
	{
		this.itemLeft[i].distance = Math.abs(containerLeft - this.itemLeft[i].left);
		
		if(minDistance > this.itemLeft[i].distance)
		{
			minDistance = this.itemLeft[i].distance;
			minIndex = i;
		}
	}
	
	return {'idx' : minIndex, 'distance' : minDistance, 'left' : this.itemLeft[minIndex].left};
};

/**
 * jQuery selectorSingleton
 * @param select
 * @return Object
 */

var selectorSingleton = function(select)
{
	this.$_obj;
	this.select = select;
};

selectorSingleton.prototype.getNew = function()
{
	if(this.$_obj != undefined)
	{
		this.$_obj.remove();
	}
	
	this.$_obj = $(this.select).clone();
	return this.$_obj;
};

selectorSingleton.prototype.getInstance = function()
{
	if(this.$_obj != undefined)
	{
		return this.$_obj;
	}
	else
	{
		return $(this.select);
	}
};
