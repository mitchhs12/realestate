import{f as T,c as I,r as h,b3 as U,b4 as V,j as p,az as A,av as D,b5 as K,a4 as z,aL as N,aC as W,b6 as q,b7 as F,ax as J}from"./sanity-DjTIZI-U.js";const M=T(D)`
  position: relative;
`;function Q(n){const t=I(3),{children:e}=n,{collapsed:a}=K();let r;return t[0]!==e||t[1]!==a?(r=p.jsx(M,{hidden:a,height:"fill",overflow:"auto",children:e}),t[0]=e,t[1]=a,t[2]=r):r=t[2],r}function X(n){const t=I(11),{actionHandlers:e,index:a,menuItems:r,menuItemGroups:l,title:o}=n,{features:d}=z();if(!(r!=null&&r.length)&&!o)return null;let s;t[0]!==e||t[1]!==l||t[2]!==r?(s=p.jsx(F,{menuItems:r,menuItemGroups:l,actionHandlers:e}),t[0]=e,t[1]=l,t[2]=r,t[3]=s):s=t[3];let i;t[4]!==d.backButton||t[5]!==a?(i=d.backButton&&a>0&&p.jsx(N,{as:W,"data-as":"a",icon:q,mode:"bleed",tooltipProps:{content:"Back"}}),t[4]=d.backButton,t[5]=a,t[6]=i):i=t[6];let c;return t[7]!==s||t[8]!==i||t[9]!==o?(c=p.jsx(J,{actions:s,backButton:i,title:o}),t[7]=s,t[8]=i,t[9]=o,t[10]=c):c=t[10],c}var Y=Object.defineProperty,Z=Object.defineProperties,ee=Object.getOwnPropertyDescriptors,b=Object.getOwnPropertySymbols,S=Object.prototype.hasOwnProperty,H=Object.prototype.propertyIsEnumerable,g=(n,t,e)=>t in n?Y(n,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):n[t]=e,B=(n,t)=>{for(var e in t||(t={}))S.call(t,e)&&g(n,e,t[e]);if(b)for(var e of b(t))H.call(t,e)&&g(n,e,t[e]);return n},te=(n,t)=>Z(n,ee(t)),E=(n,t)=>{var e={};for(var a in n)S.call(n,a)&&t.indexOf(a)<0&&(e[a]=n[a]);if(n!=null&&b)for(var a of b(n))t.indexOf(a)<0&&H.call(n,a)&&(e[a]=n[a]);return e};function re(n){var t;const e=I(33);let a,r,l,o;e[0]!==n?(t=n,{index:a,pane:r,paneKey:l}=t,o=E(t,["index","pane","paneKey"]),e[0]=n,e[1]=a,e[2]=r,e[3]=l,e[4]=o):(a=e[1],r=e[2],l=e[3],o=e[4]);let d,s,i,c,u;if(e[5]!==r){const w=r,{child:C,component:G,menuItems:R,menuItemGroups:$,type:ne}=w,L=E(w,["child","component","menuItems","menuItemGroups","type"]);d=C,s=G,c=R,i=$,u=L,e[5]=r,e[6]=d,e[7]=s,e[8]=i,e[9]=c,e[10]=u}else d=e[6],s=e[7],i=e[8],c=e[9],u=e[10];const[y,k]=h.useState(null),{title:v}=U(r),j=v===void 0?"":v,O=y==null?void 0:y.actionHandlers;let m;e[11]!==a||e[12]!==i||e[13]!==c||e[14]!==O||e[15]!==j?(m=p.jsx(X,{actionHandlers:O,index:a,menuItems:c,menuItemGroups:i,title:j}),e[11]=a,e[12]=i,e[13]=c,e[14]=O,e[15]=j,e[16]=m):m=e[16];let f;e[17]!==d||e[18]!==s||e[19]!==l||e[20]!==u||e[21]!==o?(f=V.isValidElementType(s)&&h.createElement(s,te(B(B({},o),u),{ref:k,child:d,paneKey:l})),e[17]=d,e[18]=s,e[19]=l,e[20]=u,e[21]=o,e[22]=f):f=e[22];let _;e[23]!==s?(_=h.isValidElement(s)&&s,e[23]=s,e[24]=_):_=e[24];let P;e[25]!==f||e[26]!==_?(P=p.jsxs(Q,{children:[f,_]}),e[25]=f,e[26]=_,e[27]=P):P=e[27];let x;return e[28]!==l||e[29]!==o.isSelected||e[30]!==m||e[31]!==P?(x=p.jsxs(A,{id:l,minWidth:320,selected:o.isSelected,children:[m,P]}),e[28]=l,e[29]=o.isSelected,e[30]=m,e[31]=P,e[32]=x):x=e[32],x}export{re as default};
