/**
 * ���ݻ�����ƣ�
 * tab��������
 * �ӳٵ���select���ã�
 * �������ܼ�����
 * �¼�ͳһlisten����
 * �����߼���������
*/

void function (W, $) {
	'use strict';
	
	$.extend({
		//��¡һ��������
		arrClone: function (arr) {
			return arr.slice(0);
		},
		
		//ɾ��ĳ��index��Ԫ��
		arrDelete: function (arr, index) {
			return arr.splice(index, 1);
		},
		
		//����ĳstr�������е�index
		arrIndex: function (arr, str) {
			return this.inArray(str, arr);
		},
		
		//ȥ�ء�ȥ��ֵ��ȥnull��ȥundefined
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
		
		//ȥ����Ԫ�أ���['aaa', 'bbb', 'aa']ȥ��'aa'
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
			timeout,	//�����ַ�������ʱ��
			methods,
			allowShow = true,	//�����ֶ��ر�div��ajax���ؽ�����Դ�div��bug
			activeClass = options.currentLiactiveClass || 'hover',
			val = '',	//��������ָ�����ܼ����������ܼ����ַ���
			suggestCache = {}
		;
		
		//\u4e5f\u53ef\u6309\u0054\u0061\u0062\u6216\u2193\u952e\u9009\u62e9
		$input.after('<div class="typeahead"><div class="tip color">Ҳ�ɰ�Tab�����ѡ��</div><div class="list"></div></div>');
		var $div = $input.siblings('.typeahead');
		
		//�ص���$.fn.typeahead��ʽ����
		$.fn.typeahead.getDataContainer = function () {
			return $div;
		};
		
		//�������顢�����ַ���
		$.fn.typeahead.dataRender = function (resObj) {
			var dataArray = resObj['suggests'], query = resObj['query'];
			var html = '', arr, reg;
			
			if (query != '') {
				arr = query.split(/\s/g);
				
				//ȥ�ء�ȥ�ա�ȥnull��ȥundefined
				arr = $.arrUnique(arr);
				
				//ȥ������
				arr = $.arrDelContain(arr);
			}
			
			$(dataArray).each(function (k, v) {
				var val = v;
				
				if (arr.length) {
					$(arr).each(function (kk, vv) {
						//�����������replace�з��ɴ������
						reg = new RegExp(vv, 'g');
						v = v.replace(reg, '<b>'+ vv +'</b>');
					});
				}
				
				html += '<li data-key="'+ val +'">'+ v +'</li>';
			});
			
			//�ж��Ƿ���links��
			//\uff08\u5b98\u65b9\uff09
			if (resObj['links']) {
				var lik = resObj['links']['link'];
				html = '<li data-key="'+ lik['title'] +'"><p link="'+ lik['href'] +'" title="'+ lik['title'] +'���ٷ���"><img src="'+ lik['ico'] +'"><b>'+ lik['title'] +'</b><span>'+ lik['host'] +'</span></p></li>' + html;
			}
			
			//����html����
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
				
				//����div���ʼ�ʧȥ����ʱ�ٵ��div��input�����޷��ر�div��bug
				$input.hover(function () {
					that.bodyClick(0);
				},function () {
					that.bodyClick(1);
				});
				
				//�������div��ѡ��liʱ��blur�����޷���ֵinput��bug
				$div.hover(function () {
					$input.off('blur');
				},function () {
					$input.off('blur').on('blur', that.inputOnBlur);
				});
				
				$input.on('blur', this.inputOnBlur);
				$input.on('click focus', this.inputOnClickOnFocus);
				$input.on('keydown', this.inputOnKeydown);
				
				//���ڴ�С�仯ʱ��ʱ����div����
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
				
				//ѡ��ֵ��ִ���ύ�ص�
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
				//ָ��13�س���38�ϼ�ͷ��40�¼�ͷ��9Tab���ܼ�����������
				//console.log(e.keyCode);
				
				var $lis = $div.find('li');
				var $hover = $div.find('li.' + activeClass);
				var userInsert = function () {
					$hover.removeClass(activeClass);
					$input.val($input.data('val'));
				}
				
				//�����ַ��󲻿�����ʾ�б�ֱ�ӻس�
				if (e.keyCode === 13) {
					$div.hide();
					allowShow = false;
					$hover.trigger('click.select');
					
					return ;
				}
				
				//����ʾ�б�����ѡ��liʱ��38��40��9��Ĭ��ѡ�е�һ�����ֵ
				if ($lis.size() && !$hover.size() && (e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 9)) {
					e.preventDefault();
					
					if (e.keyCode === 38) {
						$input.val($lis.last().addClass(activeClass).data('key'));
					} else if (e.keyCode === 40 || e.keyCode === 9) {
						$input.val($lis.first().addClass(activeClass).data('key'));
					}
					
					//���ܼ���ֵ
					val = $input.val();
					
					return ;
				}
				
				if (e.keyCode === 38) {
					//��ֹ�������ǰ���ú��bug
					e.preventDefault();
					
					if ($lis.index($hover) !== 0) {
						$input.val($hover.removeClass(activeClass).prev().addClass(activeClass).data('key'));
					} else {
						//$input.val($hover.removeClass(activeClass).siblings(':last').addClass(activeClass).data('key'));
						userInsert();
					}
					
					//���ܼ���ֵ
					val = $input.val();
				} else if (e.keyCode === 40 || e.keyCode === 9) {
					e.preventDefault();
					
					if ($lis.index($hover) !== ($lis.size() - 1)) {
						$input.val($hover.removeClass(activeClass).next().addClass(activeClass).data('key'));
					} else {
						//$input.val($hover.removeClass(activeClass).siblings(':first').addClass(activeClass).data('key'));
						userInsert();
					}
					
					//���ܼ���ֵ
					val = $input.val();
				} else {
					if (options.ajax) {
						//ֹͣ������700msִ��ajax��clearTimeout��ǰ��ֹ���水����Ƶ
						clearTimeout(timeout);
							
						setTimeout(function() {
							//console.clear();
							//console.log($input.val());
							//console.log(suggestCache);
							
							//�жϻ���
							if (suggestCache[$input.val()]) {
								methods.showDiv(suggestCache[$input.val()]);
								return ;
							}
							
							timeout = setTimeout(function() {
								if (val !== $input.val()) {
									//�ַ�������ֵ
									val = $input.val();
									$input.data('val', val);
									
									//����ɾ��hover
									$hover.removeClass(activeClass);
									
									//�ص�ajax����
									options.ajax();
								}
							}, 700);
						}, 0);
					}
				}
			}
		}
		
		//div.typeahead �Ѵ���
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
			//��¼ҳ��
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
							
							//�������ݣ�http://suggestion.baidu.com/su?wd=��Ѷ&json=1&p=3
							/*var resStr = '{"query":"��Ѷ","neusoftsEngineStatus":"successful","other":"","suggests":["��Ѷ��Ƶ","��Ѷ��ҳ","��Ѷ΢��","��Ѷ��Ϸ","��Ѷ����","��Ѷ���Թܼ�","��Ѷqq","��Ѷ��ͼ","��Ѷ��Ϸƽ̨","��Ѷ�ֻ��ܼ�"],"links":{"type":"6", "link":{"title":"��Ѷ��", "host":"www.qq.com", "href":"http://www.qq.com/", "ico":"http://t12.baidu.com/it/u=617708633,962610562&fm=58", "match":"��Ѷ"}}}';
							typeahead.dataRender(JSON.parse(resStr));
							$text.removeClass(loadingClass);
							typeahead.getDataContainer().removeClass(loadingClass);
							console.log('��ģ��ִ��ajax');*/
							
							//Զ������
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
					//����Ļ�ֱ�������height
					'line-height': (availHeight - availHeight*0.15) + 'px'
				}).slideDown(1200, function () {
					$text.focus();
				});
				
				$iframe.height(availHeight + 46);
				
				this.initSelect();

				//��Ĭ�ϼ�������Ϊ�յ���Դ
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
				
				//��ʼ��ҳ��
				page = 0;					
			},
			
			submitOnClick: function () {
				var text = $.trim($text.val());
			
				$text.val(text);
	
				if (text === '') {
					//\u8bf7\u8f93\u5165 Google/Baidu \u641c\u7d22\u5173\u952e\u8bcd
					W.alert('������ Google/Baidu �����ؼ���');
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
				
				//��ʼ������optionֵ
				this.initSelect();
				
				//��ʾ��1ҳ��ʾ
				text !== '' && this.showPageNum(1);
				
				//����suggest������
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
				$option.text($option.data('val') + ' (��' + pageNum + 'ҳ)');
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
					W.prompt('��IE��������븴������URL������������ղؼУ�', url);
				}
			},
			
			listen: function () {
				//����ԭ����������Ӧָ���ض�������
				$select.on('change', $.proxy(this.selectOnChange, this));
				
				//������ΪDOM���󣬹�Ӧָ���ض�������
				$submit.on('click', $.proxy(this.submitOnClick, this));
				
				$(doc).on('keyup', this.documentOnKeyup);
				
				//����ԭ����������Ӧָ���ض�������
				$btns.eq(0).on('click', $.proxy(this.btns0OnClick, this));
				$btns.eq(1).on('click', $.proxy(this.btns1OnClick, this));
				
				$btns.eq(2).on('click', this.btns2OnClick);
			}
		}
		
		new Methods();
	});
}(window, jQuery);