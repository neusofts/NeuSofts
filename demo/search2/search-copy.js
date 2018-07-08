/**
 * 数据缓存机制！
 * tab键操作！
 * 延迟导致select重置！
 * 其他功能键处理！
 * 事件统一listen管理！
 * 按键逻辑处理整理？
*/

void function (W, $) {
	'use strict';
	
	$.extend({
		//克隆一份新数组
		arrClone: function (arr) {
			return arr.slice(0);
		},
		
		//删除某个index的元素
		arrDelete: function (arr, index) {
			return arr.splice(index, 1);
		},
		
		//返回某str在数组中的index
		arrIndex: function (arr, str) {
			return this.inArray(str, arr);
		},
		
		//去重、去空值、去null、去undefined
		arrUnique: function (arr) {
			var tempObj = {}, newArr = [];
			
			for (var i = 0, elem; (elem = arr[i]) != null; i++) {
				if (!tempObj[elem] && arr[i] != '') {
					newArr.push(elem);
					tempObj[elem] = true;
				}
			}
			
			return newArr;
		},
		
		//去包含元素，如['aaa', 'bbb', 'aa']去除'aa'
		arrDelContain: function (arr) {
			var that = this, arr2 = this.arrClone(arr);
			
			that.each(arr2, function (k, v) {
				that.each(arr, function (kk, vv) {
					if (v != vv && v.indexOf(vv) > -1) {
						that.arrDelete(arr, kk);
					}
				});
			});
			
			return arr;
		}
	});
	
	$.fn.typeahead = function (options) {
		var 
			$input = $(this),
			timeout,	//操作字符键空闲时间
			methods,
			allowShow = true,	//处理手动关闭div后ajax返回结果后仍打开div的bug
			activeClass = options.currentLiactiveClass || 'hover',
			val = '',	//用作区分指定功能键、其他功能键、字符键
			suggestCache = {}
		;
		
		//\u4e5f\u53ef\u6309\u0054\u0061\u0062\u6216\u2193\u952e\u9009\u62e9
		$input.after('<div class="typeahead"><div class="tip color">也可按Tab或↓键选择</div><div class="list"></div></div>');
		var $div = $input.siblings('.typeahead');
		
		//回调中$.fn.typeahead方式调用
		$.fn.typeahead.getDataContainer = function () {
			return $div;
		};
		
		//传入数组、搜索字符串
		$.fn.typeahead.dataRender = function (resObj) {
			var dataArray = resObj['suggests'], query = resObj['query'];
			var html = '', arr, reg;
			
			if (query != '') {
				arr = query.split(/\s/g);
				
				//去重、去空、去null、去undefined
				arr = $.arrUnique(arr);
				
				//去包含项
				arr = $.arrDelContain(arr);
			}
			
			$(dataArray).each(function (k, v) {
				var val = v;
				
				if (arr.length) {
					$(arr).each(function (kk, vv) {
						//创建正则对象replace中方可传入变量
						reg = new RegExp(vv, 'g');
						v = v.replace(reg, '<b>'+ vv +'</b>');
					});
				}
				
				html += '<li data-key="'+ val +'">'+ v +'</li>';
			});
			
			//判断是否有links，
			//\uff08\u5b98\u65b9\uff09
			if (resObj['links']) {
				var lik = resObj['links']['link'];
				html = '<li data-key="'+ lik['title'] +'"><p link="'+ lik['href'] +'" title="'+ lik['title'] +'（官方）"><img src="'+ lik['ico'] +'"><b>'+ lik['title'] +'</b><span>'+ lik['host'] +'</span></p></li>' + html;
			}
			
			//创建html缓存
			suggestCache[query] = html;
			
			methods.showDiv(html);
		};
		
		methods = {
			init: function () {
				this.resetPositon();
			},
			
			listen: function () {
				var that = this;
				
				$div.on('click.select', 'li', this.selectLiOnClick);
				
				//处理div上邮件失去焦点时再点非div、input区域无法关闭div的bug
				$input.hover(function () {
					that.bodyClick(0);
				},function () {
					that.bodyClick(1);
				});
				
				//处理鼠标div上选择li时受blur干扰无法赋值input的bug
				$div.hover(function () {
					$input.off('blur');
				},function () {
					$input.off('blur').on('blur', that.inputOnBlur);
				});
				
				$input.on('blur', this.inputOnBlur);
				$input.on('click focus', this.inputOnClickOnFocus);
				$input.on('keydown', this.inputOnKeydown);
				
				//窗口大小变化时即时计算div坐标
				$(W).on('resize', this.resetPositon);
			},
			
			showDiv: function (html) {
				html !== '' && $div.find('div.list').html('<ul>'+ html +'</ul>');
				allowShow && $div.show().find('div.tip').slideDown(2000, function () {$(this).removeClass('color');});
			},
			
			bodyClick: function (condition) {
				var eventName = 'click.typeahead';
				
				if (condition) {
					$('body').off(eventName).on(eventName, this.inputOnBlur);
				} else {
					$('body').off(eventName);
				}
			},
			
			resetPositon: function () {
				$div.css({
					left: $input.offset().left,
					top: $input.offset().top + $input.outerHeight() - 0,
					width: $input.outerWidth() - 2
				});
			},
			
			windowOnResize: function () {
				this.resetPositon();
			},
			
			selectLiOnClick: function (e) {
				$input.val($(e.target).closest('li').data('key'));
				$(e.target).closest('li').addClass(activeClass).siblings('li').removeClass(activeClass);
				$div.hide();
				
				//选择值后执行提交回调
				if ($(e.target).closest('li').find('p').size()) {
					var $p = $(e.target).closest('li').find('p');
					var $form = $('form');
					
					$form.attr({
						action: $p.attr('link'),
						method: 'GET',
						target: '_blank'
					});
					
					$form[0].submit();
				} else {
					options.selectCallback && options.selectCallback();
				}
			},
			
			inputOnBlur: function () {
				$div.hide();
				allowShow = false;
			},
			
			inputOnClickOnFocus: function () {
				allowShow = true;
				$div.find('div.list').text() !== '' && $div.show();
			},
			
			inputOnKeydown: function (e) {
				//指定13回车、38上箭头、40下箭头、9Tab功能键，其他屏蔽
				//console.log(e.keyCode);
				
				var $lis = $div.find('li');
				var $hover = $div.find('li.' + activeClass);
				var userInsert = function () {
					$hover.removeClass(activeClass);
					$input.val($input.data('val'));
				}
				
				//键入字符后不考虑提示列表直接回车
				if (e.keyCode === 13) {
					$div.hide();
					allowShow = false;
					$hover.trigger('click.select');
					
					return ;
				}
				
				//有提示列表且无选中li时的38、40、9键默认选中第一项，并赋值
				if ($lis.size() && !$hover.size() && (e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 9)) {
					e.preventDefault();
					
					if (e.keyCode === 38) {
						$input.val($lis.last().addClass(activeClass).data('key'));
					} else if (e.keyCode === 40 || e.keyCode === 9) {
						$input.val($lis.first().addClass(activeClass).data('key'));
					}
					
					//功能键赋值
					val = $input.val();
					
					return ;
				}
				
				if (e.keyCode === 38) {
					//禁止光标先置前再置后的bug
					e.preventDefault();
					
					if ($lis.index($hover) !== 0) {
						$input.val($hover.removeClass(activeClass).prev().addClass(activeClass).data('key'));
					} else {
						//$input.val($hover.removeClass(activeClass).siblings(':last').addClass(activeClass).data('key'));
						userInsert();
					}
					
					//功能键赋值
					val = $input.val();
				} else if (e.keyCode === 40 || e.keyCode === 9) {
					e.preventDefault();
					
					if ($lis.index($hover) !== ($lis.size() - 1)) {
						$input.val($hover.removeClass(activeClass).next().addClass(activeClass).data('key'));
					} else {
						//$input.val($hover.removeClass(activeClass).siblings(':first').addClass(activeClass).data('key'));
						userInsert();
					}
					
					//功能键赋值
					val = $input.val();
				} else {
					if (options.ajax) {
						//停止按键后700ms执行ajax，clearTimeout置前防止缓存按键过频
						clearTimeout(timeout);
							
						setTimeout(function() {
							//console.clear();
							//console.log($input.val());
							//console.log(suggestCache);
							
							//判断缓存
							if (suggestCache[$input.val()]) {
								methods.showDiv(suggestCache[$input.val()]);
								return ;
							}
							
							timeout = setTimeout(function() {
								if (val !== $input.val()) {
									//字符键键赋值
									val = $input.val();
									$input.data('val', val);
									
									//立即删除hover
									$hover.removeClass(activeClass);
									
									//回调ajax处理
									options.ajax();
								}
							}, 700);
						}, 0);
					}
				}
			}
		}
		
		//div.typeahead 已创建
		if ($div.size() > 0) {
			methods.init();
			methods.listen();
		}
	}
}(window, jQuery);


void function (W, $) {
	'use strict';

	$(function () {
		var
			doc = W.document,
			protocol = doc.location.protocol + '//',
			baidu = 'baidu.com.cn/',
			google = 'google.com/',
			arr = ['s','.','p'],
			$text = $('input.text'),
			$select = $('select'),
			$submit = $('input:submit'),
			$btns = $('a.btn'),
			$iframe = $('iframe'),
			$div = $('div.body'),
			disabledClass = 'disabled',
			loadingClass = 'loading',
			query = '',
			//记录页数
			page = 0,
			availHeight = W.screen.availHeight,
			Methods
		;
		
		Methods = function () {
			this.init();
			this.listen();
		}
		
		Methods.prototype = {
			constructor: Methods,
			
			init: function () {
				var context = this;
				
				$text.typeahead({
					//currentLidisabledClass: 'hover',
					selectCallback: function () {
						$submit.trigger('click');
					},
					ajax: function () {
						var typeahead = $.fn.typeahead;
						var text = encodeURI($text.val());
						
						if ($.trim($text.val()) !== '') {
							typeahead.getDataContainer().addClass(loadingClass);
							typeahead.getDataContainer().is(':hidden') && $text.addClass(loadingClass);
							
							//测试数据，http://suggestion.baidu.com/su?wd=腾讯&json=1&p=3
							/*var resStr = '{"query":"腾讯","neusoftsEngineStatus":"successful","other":"","suggests":["腾讯视频","腾讯首页","腾讯微博","腾讯游戏","腾讯新闻","腾讯电脑管家","腾讯qq","腾讯地图","腾讯游戏平台","腾讯手机管家"],"links":{"type":"6", "link":{"title":"腾讯网", "host":"www.qq.com", "href":"http://www.qq.com/", "ico":"http://t12.baidu.com/it/u=617708633,962610562&fm=58", "match":"腾讯"}}}';
							typeahead.dataRender(JSON.parse(resStr));
							$text.removeClass(loadingClass);
							typeahead.getDataContainer().removeClass(loadingClass);
							console.log('已模拟执行ajax');*/
							
							//远程数据
							$.post(context.getPath() + 'demo/search2/', {str: text}, function (res) {
								var resStr = res;
								typeahead.dataRender(JSON.parse(resStr));
								$text.removeClass(loadingClass);
								typeahead.getDataContainer().removeClass(loadingClass);
							});
						} else {
							$text.val('');
						}
					}
				});
				
				$div.css({
					height: availHeight,
					//按屏幕分辨率设置height
					'line-height': (availHeight - availHeight*0.15) + 'px'
				}).slideDown(1200, function () {
					$text.focus();
				});
				
				$iframe.height(availHeight + 46);
				
				this.initSelect();

				//不默认加载搜索为空的资源
				//$iframe.attr('src', this.getSource());
			},
			
			getPath: function () {
				return doc.location.host.indexOf('.com') > -1 ? '/' : '/0.NeuSofts/';
			},
			
			getSource: function () {
				return protocol + baidu.split('i')[0] + 'i' + google.split('.')[0] + baidu.split('i')[1] + arr.join('') + 'hp';
			},
			
			selectOnChange: function () {
				$submit.trigger('click');
				
				//初始化页数
				page = 0;					
			},
			
			submitOnClick: function () {
				var text = $.trim($text.val());
			
				$text.val(text);
	
				if (text === '') {
					//\u8bf7\u8f93\u5165 Google/Baidu \u641c\u7d22\u5173\u952e\u8bcd
					W.alert('请输入 Google/Baidu 搜索关键词');
					$text.focus();
				} else {
					$btns.eq(0).addClass(disabledClass);
					$btns.eq(1).removeClass(disabledClass);
					query = this.getSource() + '?q=' + text + '&num=' + parseInt($select.val());
					$div.slideUp(1200, function () {
						$text.blur();
						$iframe.attr('src', query);
					});
				}
				
				//初始化所有option值
				this.initSelect();
				
				//显示第1页提示
				text !== '' && this.showPageNum(1);
				
				//调整suggest层坐标
				$(W).trigger('resize');
	
				return false;
			},
			
			documentOnKeyup: function (e) {
				e.keyCode === 13 && $submit.trigger('click');
			},
			
			initSelect: function () {
				if ($select.data('init')) {
					$select.find('option').each(function (k, v) {
						$(this).text($(this).data('val'));
					});
				} else {
					$select.find('option').each(function (k, v) {
						$(this).data('val', $(this).text());
					});
					$select.data('init', true);
				}
			},
			
			showPageNum: function (pageNum) {
				var size = parseInt($select.val());
				var $option = $select.find('option:selected');
				var pageNum = pageNum || (page/size + 1);
				//\u7b2c
				//\u9875
				$option.text($option.data('val') + ' (第' + pageNum + '页)');
			},
			
			btns0OnClick: function (e) {
				if (!$(e.target).hasClass(disabledClass)) {
					page -= parseInt($select.val());
					$iframe.attr('src', query + '&start=' + page);
					$(e.target)[page > 0 ? 'removeClass' : 'addClass'](disabledClass);
					this.showPageNum();
				}
			},
			
			btns1OnClick: function (e) {
				if (!$(e.target).hasClass(disabledClass)) {
					page += parseInt($select.val());
					$iframe.attr('src', query + '&start=' + page);
					$btns.eq(0).removeClass(disabledClass);
					this.showPageNum();
				}
			},
			
			btns2OnClick: function () {
				var url = W.top.location.href;
				
				try {
					W.external.AddFavorite(url, doc.title);
				} catch(e) {
					//\u975e\u0049\u0045\u6d4f\u89c8\u5668\uff0c\u8bf7\u590d\u5236\u4ee5\u4e0b\u0055\u0052\u004c\u81f3\u60a8\u7684\u6d4f\u89c8\u5668\u6536\u85cf\u5939\uff1a
					W.prompt('非IE浏览器，请复制以下URL至您的浏览器收藏夹：', url);
				}
			},
			
			listen: function () {
				//调用原型链方法，应指定特定上下文
				$select.on('change', $.proxy(this.selectOnChange, this));
				
				//调用者为DOM对象，故应指定特定上下文
				$submit.on('click', $.proxy(this.submitOnClick, this));
				
				$(doc).on('keyup', this.documentOnKeyup);
				
				//调用原型链方法，应指定特定上下文
				$btns.eq(0).on('click', $.proxy(this.btns0OnClick, this));
				$btns.eq(1).on('click', $.proxy(this.btns1OnClick, this));
				
				$btns.eq(2).on('click', this.btns2OnClick);
			}
		}
		
		new Methods();
	});
}(window, jQuery);