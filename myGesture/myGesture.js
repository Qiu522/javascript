/**
 *@grama init : {
                  el : element  //元素 （必填）
                  start :  fn    //gesturestart 要做的操作
                  change： fn    //gesturechange要做的操作
                  end：    fn    //gestureend要做的操作
                } 
 * 
 * 勾股定理
 * Math.atan2( y, x ): 斜率  由已知一条直线与x正轴所形成角的正切  返回值弧度
                角度转弧度： deg*Math.PI/180
                孤独转角度： rad*180/Math.PI
 */
function getDis( point1, point2 ){
  let disX = point2.x - point1.x;
  let disY = point2.y - point1.y;

  return Math.sqrt( disX*disX + disY*disY );
}

function getDeg ( point1, point2 ){
  let disX = point2.x - point1.x;
  let disY = point2.y - point1.y;

  return Math.atan2( disY, disX )*180/Math.PI;
}

function setGesture( init ){
  let el = init.el;
  let isGestrue = false;
  let startPoint = [];
  
  if( !el ) { return; }

  el.addEventListener('touchstart', function(ev){
    if( ev.touches.length >= 2 ){
      isGestrue = true;   //记录当前用户触发了gesturestart
      startPoint[0] = {x : ev.touches[0].pageX, y : ev.touches[0].pageY };
      startPoint[1] = {x : ev.touches[1].pageX, y : ev.touches[1].pageY };

      init.start && init.start.call( el, ev );
    }
  });

  el.addEventListener('touchmove', function(ev){
    if( isGestrue && ev.touches.length >= 2 ){
      let nowPoint = [];
      nowPoint[0] = {x : ev.touches[0].pageX, y : ev.touches[0].pageY };
      nowPoint[1] = {x : ev.touches[1].pageX, y : ev.touches[1].pageY };

      let startDis = getDis( startPoint[0], startPoint[1] ),
          nowDis = getDis( nowPoint[0], nowPoint[1] );
      let startDeg = getDeg( startPoint[0], startPoint[1] ),
          nowDeg = getDeg( nowPoint[0], nowPoint[1] );
      
      ev.scale = nowDis / startDis;
      ev.rotation = nowDeg -startDeg;
      init.change && init.change.call( el, ev );
    }
  });

  el.addEventListener('touchend', function(ev){
    if( isGestrue ){
      if( ev.touches.length < 2 || ev.targetTouches.length < 1){
        isGestrue = false;   //记录当前用户触发了gestureend
        init.end && init.end.call( el, ev );
      }
    }
  });
}
