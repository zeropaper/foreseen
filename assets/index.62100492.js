var tt=Object.defineProperty;var ot=(n,i,e)=>i in n?tt(n,i,{enumerable:!0,configurable:!0,writable:!0,value:e}):n[i]=e;var H=(n,i,e)=>(ot(n,typeof i!="symbol"?i+"":i,e),e),He=(n,i,e)=>{if(!i.has(n))throw TypeError("Cannot "+e)};var m=(n,i,e)=>(He(n,i,"read from private field"),e?e.call(n):i.get(n)),C=(n,i,e)=>{if(i.has(n))throw TypeError("Cannot add the same private member more than once");i instanceof WeakSet?i.add(n):i.set(n,e)},_=(n,i,e,t)=>(He(n,i,"write to private field"),t?t.call(n,e):i.set(n,e),e);var B=(n,i,e)=>(He(n,i,"access private method"),e);import{l as Pn,a as Pi,c as st}from"./lodash.c11a6a11.js";(function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))t(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const u of a.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&t(u)}).observe(document,{childList:!0,subtree:!0});function e(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerpolicy&&(a.referrerPolicy=s.referrerpolicy),s.crossorigin==="use-credentials"?a.credentials="include":s.crossorigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function t(s){if(s.ep)return;s.ep=!0;const a=e(s);fetch(s.href,a)}})();const lt="modulepreload",at=function(n){return"/"+n},Ui={},Zi=function(i,e,t){return!e||e.length===0?i():Promise.all(e.map(s=>{if(s=at(s),s in Ui)return;Ui[s]=!0;const a=s.endsWith(".css"),u=a?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${s}"]${u}`))return;const l=document.createElement("link");if(l.rel=a?"stylesheet":lt,a||(l.as="script",l.crossOrigin=""),l.href=s,document.head.appendChild(l),a)return new Promise((h,y)=>{l.addEventListener("load",h),l.addEventListener("error",()=>y(new Error(`Unable to preload CSS for ${s}`)))})})).then(()=>i())},re=`## Foreseen is a way to describe a Three.js scene,
## its rendering and post-processing in a YAML document
## that can be edited during live audio-visual
## performances.
##
## In this document, lines commented with a single \`#\`
## are meant to be uncommented to see the effect.
##
## Feel free to play with the values too.
##
## Press \`F1\` to open a list of editor commands.
##
## The core concepts of Three.js are top level keys.
## Theses keys are:
## - Variables - to define variables that can be used in the scene
variables:
  speed: 10
## - Cameras - if not defined, a default perspective camera is created
cameras:
  ## the key is the name of the camera
  ## for now, it is only possible to render one camera
  perspective:
    ## The type of camera is \`perspective\` by default
    ## but you can change it to \`orthographic\`.
    ## A camera can be positioned in the world,
    ## the default position is (0, 0, 0)
    position:
      x: 6
      y: 15
      z: 15
    ## The camera can be oriented in the world
    ## by telling where to look at
    ## It is looking at (0, 0, 0) by default
    lookAt:
      y: 2

## - Lights - if not defined, a default spotlight is created
lights:
  spot:
    castShadow: true
    position:
      x: -6
      y: 15
      z: 15

## - Materials - if not defined, a default material is created
materials:
  defaultMaterial:
    color: 0xff00ff
  otherMaterial:
    color: 0xffff00
  planeMesh:
    color: 0x0000ff
    opacity: 0.2
    transparent: true

## - Meshes - if not defined, a default box is created
meshes:
  planeMesh:
    ## They are defined by their type (which would be a Three.js geometry)
    ## and their material.
    ## In the case of this particular "planeMesh", a material named the same
    ## exists in the "materials" key and will be used.
    type: plane
    receiveShadow: true
    width: 30
    height: 30
    ## Unlike in Three.js, the rotation is defined
    ## in degrees instead of radians
    rotation:
      x: -90
      ## You can use some simple math and variables
      z: $now * 10 % 360

  cylinder:
    ## When a mesh has no material, the default material,
    ## first in the "materials" key, is used
    # material: otherMaterial
    receiveShadow: true
    castShadow: true
    type: cylinder
    height: 8
    radialSegments: 24
    position:
      x: -10
      y: sin($now) * 8
    rotation:
      x: $now * $speed
  ## You can use the same mesh several times in the scene
  ## by using the "+copy" directive.
  ## Besides "meshes", directives can also be used in
  ## "renderers", "lights", "materials" and "cameras".
  +copy(cylinder, 4):
    ## You can change some properties of the copy
    material: otherMaterial
    position:
      x: (_index * 4) - 10
    rotation:
      x: $now * $speed * (_index + 1)

  +copy(planeMesh, 2):
    material: planeMesh
    position:
      y: _index * 2
`,ut=`variables:
  n: $now * 100
materials:
  star:
    color: 0xff0000
    wireframe: false
  planet:
    color: 0xff00ff
    wireframe: false
  moon:
    color: 0x0000ff
    wireframe: false
meshes:
  star:
    material: star
    type: sphere
    radius: 5
  planetA:
    rotation:
      y: $n
    children:
      body:
        type: sphere
        radius: 3
        material: planet
        position:
          x: 20
      moons:
        position:
          x: 20
        rotation:
          z: 45
        children:
          moon1:
            position:
              x: 6
            children:
              body:
                type: sphere
                radius: 1
                material: moon
          moon2:
            position:
              x: 4.5
            children:
              body:
                type: sphere
                radius: 0.5
                material: moon
`,ct=`variables:
  hW: 13
  # Total width
  ttW: $hW * 2
  bX: ($hW * -1) - 1
  # Total height
  ttH: 5
materials:
  black:
    color: 0x000000
    wireframe: false
  white:
    color: 0xffffff
meshes:
  b-0-0:
    position:
      x: $bX
      z: -0
  b-0-1:
    position:
      x: $bX
      z: -1
  b-0-2:
    position:
      x: $bX
      z: -2
  b-0-3:
    position:
      x: $bX
      z: -3
  b-0-4:
    position:
      x: $bX
      z: -4
  b-0-5:
    position:
      x: $bX
      z: -5
  b-0-6:
    position:
      x: $bX
      z: -6
  b-0-7:
    position:
      x: $bX
      z: -7
  b-0-8:
    position:
      x: $bX
      z: -8
  b-0-9:
    position:
      x: $bX
      z: -9
  b-0-10:
    position:
      x: $bX
      z: -10
  b-0-11:
    position:
      x: $bX
      z: -11
  b-0-12:
    position:
      x: $bX
      z: -12
  b-0-13:
    position:
      x: $bX
      z: -13
  b-0-13-1:
    position:
      x: $bX
      z: -14
      y: -1
  b-0-13-2:
    position:
      x: $bX
      z: -15
      y: -2

      ############

  b-1-0:
    position:
      x: $hW
      z: -0
  b-1-1:
    position:
      x: $hW
      z: -1
  b-1-2:
    position:
      x: $hW
      z: -2
  b-1-3:
    position:
      x: $hW
      z: -3
  b-1-4:
    position:
      x: $hW
      z: -4
  b-1-5:
    position:
      x: $hW
      z: -5
  b-1-6:
    position:
      x: $hW
      z: -6
  b-1-7:
    position:
      x: $hW
      z: -7
  b-1-8:
    position:
      x: $hW
      z: -8
  b-1-9:
    position:
      x: $hW
      z: -9
  b-1-10:
    position:
      x: $hW
      z: -10
  b-1-11:
    position:
      x: $hW
      z: -11
  b-1-12:
    position:
      x: $hW
      z: -12
  b-1-13:
    position:
      x: $hW
      z: -13
  b-1-13-1:
    position:
      x: $hW
      z: -14
      y: -1
  b-1-13-2:
    position:
      x: $hW
      z: -15
      y: -2

      ############
  b-2-1:
    position:
      x: $bX + 1
  b-2-2:
    position:
      x: $bX + 2
  b-2-3:
    position:
      x: $bX + 3
  b-2-4:
    position:
      x: $bX + 4
  b-2-5:
    position:
      x: $bX + 5
  b-2-6:
    position:
      x: $bX + 6
  b-2-7:
    position:
      x: $bX + 7
  b-2-8:
    position:
      x: $bX + 8
  b-2-9:
    position:
      x: $bX + 9
  b-2-10:
    position:
      x: $bX + 10
  b-2-11:
    position:
      x: $bX + 11
  b-2-12:
    position:
      x: $bX + 12
  b-2-13:
    position:
      x: $bX + 13

      ############
  b-3-1:
    position:
  b-3-2:
    position:
      x: 1
  b-3-3:
    position:
      x: 2
  b-3-4:
    position:
      x: 3
  b-3-5:
    position:
      x: 4
  b-3-6:
    position:
      x: 5
  b-3-7:
    position:
      x: 6
  b-3-8:
    position:
      x: 7
  b-3-9:
    position:
      x: 8
  b-3-10:
    position:
      x: 9
  b-3-11:
    position:
      x: 10
  b-3-12:
    position:
      x: 11
  b-3-13:
    position:
      x: 12
  #####

  #####
  b-22-1:
    position:
      y: -1
      x: $bX + 1
  b-22-2:
    position:
      y: -1
      x: $bX + 2
  b-22-3:
    position:
      y: -1
      x: $bX + 3
  b-22-4:
    position:
      y: -1
      x: $bX + 4
  b-22-5:
    position:
      y: -1
      x: $bX + 5
  b-22-6:
    position:
      y: -1
      x: $bX + 6
  b-22-7:
    position:
      y: -1
      x: $bX + 7
  b-22-8:
    position:
      y: -1
      x: $bX + 8
  b-22-9:
    position:
      y: -1
      x: $bX + 9
  b-22-10:
    position:
      y: -1
      x: $bX + 10
  b-22-11:
    position:
      y: -1
      x: $bX + 11
  b-22-12:
    position:
      y: -1
      x: $bX + 12
  b-22-13:
    position:
      y: -1
      x: $bX + 13

      ############
  b-23-1:
    position:
      y: -1
  b-23-2:
    position:
      y: -1
      x: 1
  b-23-3:
    position:
      y: -1
      x: 2
  b-23-4:
    position:
      y: -1
      x: 3
  b-23-5:
    position:
      y: -1
      x: 4
  b-23-6:
    position:
      y: -1
      x: 5
  b-23-7:
    position:
      y: -1
      x: 6
  b-23-8:
    position:
      y: -1
      x: 7
  b-23-9:
    position:
      y: -1
      x: 8
  b-23-10:
    position:
      y: -1
      x: 9
  b-23-11:
    position:
      y: -1
      x: 10
  b-23-12:
    position:
      y: -1
      x: 11
  b-23-13:
    position:
      y: -1
      x: 12

  #####

  #####
  b-32-2:
    position:
      y: -2
      x: $bX + 2
  b-32-3:
    material: white
    position:
      y: -2
      x: $bX + 3
  b-32-4:
    position:
      y: -2
      x: $bX + 4
  b-32-5:
    material: white
    position:
      y: -2
      x: $bX + 5
  b-32-6:
    position:
      y: -2
      x: $bX + 6
  b-32-7:
    position:
      y: -2
      x: $bX + 7
  b-32-8:
    position:
      y: -2
      x: $bX + 8
  b-32-9:
    position:
      y: -2
      x: $bX + 9
  b-32-10:
    position:
      y: -2
      x: $bX + 10
  b-32-11:
    position:
      y: -2
      x: $bX + 11
  b-32-12:
    position:
      y: -2
      x: $bX + 12

      ############
  b-33-2:
    position:
      y: -2
      x: 1
  b-33-3:
    material: white
    position:
      y: -2
      x: 2
  b-33-4:
    position:
      y: -2
      x: 3
  b-33-5:
    material: white
    position:
      y: -2
      x: 4
  b-33-6:
    position:
      y: -2
      x: 5
  b-33-7:
    position:
      y: -2
      x: 6
  b-33-8:
    position:
      y: -2
      x: 7
  b-33-9:
    position:
      y: -2
      x: 8
  b-33-10:
    position:
      y: -2
      x: 9
  b-33-11:
    position:
      y: -2
      x: 10
  b-33-12:
    position:
      y: -2
      x: 11

  #####

  #####
  b-42-3:
    position:
      y: -3
      x: $bX + 3
  b-42-4:
    material: white
    position:
      y: -3
      x: $bX + 4
  b-42-5:
    position:
      y: -3
      x: $bX + 5
  b-42-6:
    material: white
    position:
      y: -3
      x: $bX + 6
  b-42-7:
    position:
      y: -3
      x: $bX + 7
  b-42-8:
    position:
      y: -3
      x: $bX + 8
  b-42-9:
    position:
      y: -3
      x: $bX + 9
  b-42-10:
    position:
      y: -3
      x: $bX + 10
  b-42-11:
    position:
      y: -3
      x: $bX + 11

      ############
  b-43-3:
    position:
      y: -3
      x: 2
  b-43-4:
    material: white
    position:
      y: -3
      x: 3
  b-43-5:
    position:
      y: -3
      x: 4
  b-43-6:
    material: white
    position:
      y: -3
      x: 5
  b-43-7:
    position:
      y: -3
      x: 6
  b-43-8:
    position:
      y: -3
      x: 7
  b-43-9:
    position:
      y: -3
      x: 8
  b-43-10:
    position:
      y: -3
      x: 9
  b-43-11:
    position:
      y: -3
      x: 10

  #####

  #####
  b-52-4:
    position:
      y: -4
      x: $bX + 4
  b-52-5:
    material: white
    position:
      y: -4
      x: $bX + 5
  b-52-6:
    position:
      y: -4
      x: $bX + 6
  b-52-7:
    material: white
    position:
      y: -4
      x: $bX + 7
  b-52-8:
    position:
      y: -4
      x: $bX + 8
  b-52-9:
    position:
      y: -4
      x: $bX + 9
  b-52-10:
    position:
      y: -4
      x: $bX + 10

      ############
  b-53-4:
    position:
      y: -4
      x: 3
  b-53-5:
    material: white
    position:
      y: -4
      x: 4
  b-53-6:
    position:
      y: -4
      x: 5
  b-53-7:
    material: white
    position:
      y: -4
      x: 6
  b-53-8:
    position:
      y: -4
      x: 7
  b-53-9:
    position:
      y: -4
      x: 8
  b-53-10:
    position:
      y: -4
      x: 9

  #####

  #####
  b-62-5:
    position:
      y: -5
      x: $bX + 5
  b-62-6:
    position:
      y: -5
      x: $bX + 6
  b-62-7:
    position:
      y: -5
      x: $bX + 7
  b-62-8:
    position:
      y: -5
      x: $bX + 8
  b-62-9:
    position:
      y: -5
      x: $bX + 9

      ############
  b-63-5:
    position:
      y: -5
      x: 4
  b-63-6:
    position:
      y: -5
      x: 5
  b-63-7:
    position:
      y: -5
      x: 6
  b-63-8:
    position:
      y: -5
      x: 7
  b-63-9:
    position:
      y: -5
      x: 8
`;var Ke={},hn={},de={};(function(n){Object.defineProperty(n,"__esModule",{value:!0});var i;(function(h){h[h.SCALAR=0]="SCALAR",h[h.MAPPING=1]="MAPPING",h[h.MAP=2]="MAP",h[h.SEQ=3]="SEQ",h[h.ANCHOR_REF=4]="ANCHOR_REF",h[h.INCLUDE_REF=5]="INCLUDE_REF"})(i=n.Kind||(n.Kind={}));function e(h,y){var d=y?y.endPosition:h.endPosition+1,g={key:h,value:y,startPosition:h.startPosition,endPosition:d,kind:i.MAPPING,parent:null,errors:[]};return g}n.newMapping=e;function t(h,y,d,g){return{errors:[],referencesAnchor:h,value:g,startPosition:y,endPosition:d,kind:i.ANCHOR_REF,parent:null}}n.newAnchorRef=t;function s(h){h===void 0&&(h="");var y={errors:[],startPosition:-1,endPosition:-1,value:""+h,kind:i.SCALAR,parent:null,doubleQuoted:!1,rawValue:""+h};return typeof h!="string"&&(y.valueObject=h),y}n.newScalar=s;function a(){return{errors:[],startPosition:-1,endPosition:-1,items:[],kind:i.SEQ,parent:null}}n.newItems=a;function u(){return a()}n.newSeq=u;function l(h){return{errors:[],startPosition:-1,endPosition:-1,mappings:h||[],kind:i.MAP,parent:null}}n.newMap=l})(de);var Z={};Object.defineProperty(Z,"__esModule",{value:!0});function nr(n){return typeof n>"u"||n===null}Z.isNothing=nr;function ft(n){return typeof n=="object"&&n!==null}Z.isObject=ft;function ht(n){return Array.isArray(n)?n:nr(n)?[]:[n]}Z.toArray=ht;function pt(n,i){var e,t,s,a;if(i)for(a=Object.keys(i),e=0,t=a.length;e<t;e+=1)s=a[e],n[s]=i[s];return n}Z.extend=pt;function dt(n,i){var e="",t;for(t=0;t<i;t+=1)e+=n;return e}Z.repeat=dt;function mt(n){return n===0&&Number.NEGATIVE_INFINITY===1/n}Z.isNegativeZero=mt;var yt=function(){function n(i,e,t){e===void 0&&(e=null),t===void 0&&(t=!1),this.name="YAMLException",this.reason=i,this.mark=e,this.message=this.toString(!1),this.isWarning=t}return n.isInstance=function(i){if(i!=null&&i.getClassIdentifier&&typeof i.getClassIdentifier=="function")for(var e=0,t=i.getClassIdentifier();e<t.length;e++){var s=t[e];if(s==n.CLASS_IDENTIFIER)return!0}return!1},n.prototype.getClassIdentifier=function(){var i=[];return i.concat(n.CLASS_IDENTIFIER)},n.prototype.toString=function(i){i===void 0&&(i=!1);var e;return e="JS-YAML: "+(this.reason||"(unknown reason)"),!i&&this.mark&&(e+=" "+this.mark.toString()),e},n.CLASS_IDENTIFIER="yaml-ast-parser.YAMLException",n}(),me=yt,Di=Z,xt=function(){function n(i,e,t,s,a){this.name=i,this.buffer=e,this.position=t,this.line=s,this.column=a}return n.prototype.getSnippet=function(i,e){i===void 0&&(i=0),e===void 0&&(e=75);var t,s,a,u,l;if(!this.buffer)return null;for(i=i||4,e=e||75,t="",s=this.position;s>0&&`\0\r
\x85\u2028\u2029`.indexOf(this.buffer.charAt(s-1))===-1;)if(s-=1,this.position-s>e/2-1){t=" ... ",s+=5;break}for(a="",u=this.position;u<this.buffer.length&&`\0\r
\x85\u2028\u2029`.indexOf(this.buffer.charAt(u))===-1;)if(u+=1,u-this.position>e/2-1){a=" ... ",u-=5;break}return l=this.buffer.slice(s,u),Di.repeat(" ",i)+t+l+a+`
`+Di.repeat(" ",i+this.position-s+t.length)+"^"},n.prototype.toString=function(i){i===void 0&&(i=!0);var e,t="";return this.name&&(t+='in "'+this.name+'" '),t+="at line "+(this.line+1)+", column "+(this.column+1),i||(e=this.getSnippet(),e&&(t+=`:
`+e)),t},n}(),gt=xt,Mn={},z={};Object.defineProperty(z,"__esModule",{value:!0});var Xi=me,wt=["kind","resolve","construct","instanceOf","predicate","represent","defaultStyle","styleAliases"],bt=["scalar","sequence","mapping"];function Et(n){var i={};return n!==null&&Object.keys(n).forEach(function(e){n[e].forEach(function(t){i[String(t)]=e})}),i}var At=function(){function n(i,e){if(e=e||{},Object.keys(e).forEach(function(t){if(wt.indexOf(t)===-1)throw new Xi('Unknown option "'+t+'" is met in definition of "'+i+'" YAML type.')}),this.tag=i,this.kind=e.kind||null,this.resolve=e.resolve||function(){return!0},this.construct=e.construct||function(t){return t},this.instanceOf=e.instanceOf||null,this.predicate=e.predicate||null,this.represent=e.represent||null,this.defaultStyle=e.defaultStyle||null,this.styleAliases=Et(e.styleAliases||null),bt.indexOf(this.kind)===-1)throw new Xi('Unknown kind "'+this.kind+'" is specified for "'+i+'" YAML type.')}return n}();z.Type=At;Object.defineProperty(Mn,"__esModule",{value:!0});var zi=Z,we=me,vt=z;function Qe(n,i,e){var t=[];return n.include.forEach(function(s){e=Qe(s,i,e)}),n[i].forEach(function(s){e.forEach(function(a,u){a.tag===s.tag&&t.push(u)}),e.push(s)}),e.filter(function(s,a){return t.indexOf(a)===-1})}function Ct(){var n={},i,e;function t(s){n[s.tag]=s}for(i=0,e=arguments.length;i<e;i+=1)arguments[i].forEach(t);return n}var Ft=function(){function n(i){this.include=i.include||[],this.implicit=i.implicit||[],this.explicit=i.explicit||[],this.implicit.forEach(function(e){if(e.loadKind&&e.loadKind!=="scalar")throw new we("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.")}),this.compiledImplicit=Qe(this,"implicit",[]),this.compiledExplicit=Qe(this,"explicit",[]),this.compiledTypeMap=Ct(this.compiledImplicit,this.compiledExplicit)}return n.DEFAULT=null,n.create=function(){var e,t;switch(arguments.length){case 1:e=n.DEFAULT,t=arguments[0];break;case 2:e=arguments[0],t=arguments[1];break;default:throw new we("Wrong number of arguments for Schema.create function")}if(e=zi.toArray(e),t=zi.toArray(t),!e.every(function(s){return s instanceof n}))throw new we("Specified list of super schemas (or a single Schema object) contains a non-Schema object.");if(!t.every(function(s){return s instanceof vt.Type}))throw new we("Specified list of YAML types (or a single Type object) contains a non-Type object.");return new n({include:e,explicit:t})},n}();Mn.Schema=Ft;var St=z,It=new St.Type("tag:yaml.org,2002:str",{kind:"scalar",construct:function(n){return n!==null?n:""}}),_t=z,Bt=new _t.Type("tag:yaml.org,2002:seq",{kind:"sequence",construct:function(n){return n!==null?n:[]}}),Tt=z,$t=new Tt.Type("tag:yaml.org,2002:map",{kind:"mapping",construct:function(n){return n!==null?n:{}}}),kt=Mn,Lt=new kt.Schema({explicit:[It,Bt,$t]}),Ot=z;function Mt(n){if(n===null)return!0;var i=n.length;return i===1&&n==="~"||i===4&&(n==="null"||n==="Null"||n==="NULL")}function Rt(){return null}function Nt(n){return n===null}var Pt=new Ot.Type("tag:yaml.org,2002:null",{kind:"scalar",resolve:Mt,construct:Rt,predicate:Nt,represent:{canonical:function(){return"~"},lowercase:function(){return"null"},uppercase:function(){return"NULL"},camelcase:function(){return"Null"}},defaultStyle:"lowercase"}),Ut=z;function Dt(n){if(n===null)return!1;var i=n.length;return i===4&&(n==="true"||n==="True"||n==="TRUE")||i===5&&(n==="false"||n==="False"||n==="FALSE")}function Xt(n){return n==="true"||n==="True"||n==="TRUE"}function zt(n){return Object.prototype.toString.call(n)==="[object Boolean]"}var Yt=new Ut.Type("tag:yaml.org,2002:bool",{kind:"scalar",resolve:Dt,construct:Xt,predicate:zt,represent:{lowercase:function(n){return n?"true":"false"},uppercase:function(n){return n?"TRUE":"FALSE"},camelcase:function(n){return n?"True":"False"}},defaultStyle:"lowercase"}),Ht=Z,jt=z;function Wt(n){return 48<=n&&n<=57||65<=n&&n<=70||97<=n&&n<=102}function qt(n){return 48<=n&&n<=55}function Gt(n){return 48<=n&&n<=57}function Vt(n){if(n===null)return!1;var i=n.length,e=0,t=!1,s;if(!i)return!1;if(s=n[e],(s==="-"||s==="+")&&(s=n[++e]),s==="0"){if(e+1===i)return!0;if(s=n[++e],s==="b"){for(e++;e<i;e++)if(s=n[e],s!=="_"){if(s!=="0"&&s!=="1")return!1;t=!0}return t}if(s==="x"){for(e++;e<i;e++)if(s=n[e],s!=="_"){if(!Wt(n.charCodeAt(e)))return!1;t=!0}return t}for(;e<i;e++)if(s=n[e],s!=="_"){if(!qt(n.charCodeAt(e)))return!1;t=!0}return t}for(;e<i;e++)if(s=n[e],s!=="_"){if(s===":")break;if(!Gt(n.charCodeAt(e)))return!1;t=!0}return t?s!==":"?!0:/^(:[0-5]?[0-9])+$/.test(n.slice(e)):!1}function Kt(n){var i=n,e=1,t,s,a=[];return i.indexOf("_")!==-1&&(i=i.replace(/_/g,"")),t=i[0],(t==="-"||t==="+")&&(t==="-"&&(e=-1),i=i.slice(1),t=i[0]),i==="0"?0:t==="0"?i[1]==="b"?e*parseInt(i.slice(2),2):i[1]==="x"?e*parseInt(i,16):e*parseInt(i,8):i.indexOf(":")!==-1?(i.split(":").forEach(function(u){a.unshift(parseInt(u,10))}),i=0,s=1,a.forEach(function(u){i+=u*s,s*=60}),e*i):e*parseInt(i,10)}function Qt(n){return Object.prototype.toString.call(n)==="[object Number]"&&n%1===0&&!Ht.isNegativeZero(n)}var Jt=new jt.Type("tag:yaml.org,2002:int",{kind:"scalar",resolve:Vt,construct:Kt,predicate:Qt,represent:{binary:function(n){return"0b"+n.toString(2)},octal:function(n){return"0"+n.toString(8)},decimal:function(n){return n.toString(10)},hexadecimal:function(n){return"0x"+n.toString(16).toUpperCase()}},defaultStyle:"decimal",styleAliases:{binary:[2,"bin"],octal:[8,"oct"],decimal:[10,"dec"],hexadecimal:[16,"hex"]}}),er=Z,Zt=z,no=new RegExp("^(?:[-+]?(?:[0-9][0-9_]*)\\.[0-9_]*(?:[eE][-+][0-9]+)?|\\.[0-9_]+(?:[eE][-+][0-9]+)?|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\\.[0-9_]*|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");function eo(n){return!(n===null||!no.test(n))}function io(n){var i,e,t,s;return i=n.replace(/_/g,"").toLowerCase(),e=i[0]==="-"?-1:1,s=[],0<="+-".indexOf(i[0])&&(i=i.slice(1)),i===".inf"?e===1?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY:i===".nan"?NaN:0<=i.indexOf(":")?(i.split(":").forEach(function(a){s.unshift(parseFloat(a,10))}),i=0,t=1,s.forEach(function(a){i+=a*t,t*=60}),e*i):e*parseFloat(i,10)}function ro(n,i){if(isNaN(n))switch(i){case"lowercase":return".nan";case"uppercase":return".NAN";case"camelcase":return".NaN"}else if(Number.POSITIVE_INFINITY===n)switch(i){case"lowercase":return".inf";case"uppercase":return".INF";case"camelcase":return".Inf"}else if(Number.NEGATIVE_INFINITY===n)switch(i){case"lowercase":return"-.inf";case"uppercase":return"-.INF";case"camelcase":return"-.Inf"}else if(er.isNegativeZero(n))return"-0.0";return n.toString(10)}function to(n){return Object.prototype.toString.call(n)==="[object Number]"&&(n%1!==0||er.isNegativeZero(n))}var oo=new Zt.Type("tag:yaml.org,2002:float",{kind:"scalar",resolve:eo,construct:io,predicate:to,represent:ro,defaultStyle:"lowercase"}),so=Mn,lo=new so.Schema({include:[Lt],implicit:[Pt,Yt,Jt,oo]}),ao=Mn,uo=new ao.Schema({include:[lo]}),co=z,ir=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?)?$");function fo(n){if(n===null)return!1;var i;return i=ir.exec(n),i!==null}function ho(n){var i,e,t,s,a,u,l,h=0,y=null,d,g,E;if(i=ir.exec(n),i===null)throw new Error("Date resolve error");if(e=+i[1],t=+i[2]-1,s=+i[3],!i[4])return new Date(Date.UTC(e,t,s));if(a=+i[4],u=+i[5],l=+i[6],i[7]){for(h=i[7].slice(0,3);h.length<3;)h=h+"0";h=+h}return i[9]&&(d=+i[10],g=+(i[11]||0),y=(d*60+g)*6e4,i[9]==="-"&&(y=-y)),E=new Date(Date.UTC(e,t,s,a,u,l,h)),y&&E.setTime(E.getTime()-y),E}function po(n){return n.toISOString()}var mo=new co.Type("tag:yaml.org,2002:timestamp",{kind:"scalar",resolve:fo,construct:ho,instanceOf:Date,represent:po}),yo=z;function xo(n){return n==="<<"||n===null}var go=new yo.Type("tag:yaml.org,2002:merge",{kind:"scalar",resolve:xo}),rr={},Ne={};Ne.byteLength=Eo;Ne.toByteArray=vo;Ne.fromByteArray=So;var fn=[],en=[],wo=typeof Uint8Array<"u"?Uint8Array:Array,je="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";for(var Un=0,bo=je.length;Un<bo;++Un)fn[Un]=je[Un],en[je.charCodeAt(Un)]=Un;en["-".charCodeAt(0)]=62;en["_".charCodeAt(0)]=63;function tr(n){var i=n.length;if(i%4>0)throw new Error("Invalid string. Length must be a multiple of 4");var e=n.indexOf("=");e===-1&&(e=i);var t=e===i?0:4-e%4;return[e,t]}function Eo(n){var i=tr(n),e=i[0],t=i[1];return(e+t)*3/4-t}function Ao(n,i,e){return(i+e)*3/4-e}function vo(n){var i,e=tr(n),t=e[0],s=e[1],a=new wo(Ao(n,t,s)),u=0,l=s>0?t-4:t,h;for(h=0;h<l;h+=4)i=en[n.charCodeAt(h)]<<18|en[n.charCodeAt(h+1)]<<12|en[n.charCodeAt(h+2)]<<6|en[n.charCodeAt(h+3)],a[u++]=i>>16&255,a[u++]=i>>8&255,a[u++]=i&255;return s===2&&(i=en[n.charCodeAt(h)]<<2|en[n.charCodeAt(h+1)]>>4,a[u++]=i&255),s===1&&(i=en[n.charCodeAt(h)]<<10|en[n.charCodeAt(h+1)]<<4|en[n.charCodeAt(h+2)]>>2,a[u++]=i>>8&255,a[u++]=i&255),a}function Co(n){return fn[n>>18&63]+fn[n>>12&63]+fn[n>>6&63]+fn[n&63]}function Fo(n,i,e){for(var t,s=[],a=i;a<e;a+=3)t=(n[a]<<16&16711680)+(n[a+1]<<8&65280)+(n[a+2]&255),s.push(Co(t));return s.join("")}function So(n){for(var i,e=n.length,t=e%3,s=[],a=16383,u=0,l=e-t;u<l;u+=a)s.push(Fo(n,u,u+a>l?l:u+a));return t===1?(i=n[e-1],s.push(fn[i>>2]+fn[i<<4&63]+"==")):t===2&&(i=(n[e-2]<<8)+n[e-1],s.push(fn[i>>10]+fn[i>>4&63]+fn[i<<2&63]+"=")),s.join("")}var di={};/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */di.read=function(n,i,e,t,s){var a,u,l=s*8-t-1,h=(1<<l)-1,y=h>>1,d=-7,g=e?s-1:0,E=e?-1:1,w=n[i+g];for(g+=E,a=w&(1<<-d)-1,w>>=-d,d+=l;d>0;a=a*256+n[i+g],g+=E,d-=8);for(u=a&(1<<-d)-1,a>>=-d,d+=t;d>0;u=u*256+n[i+g],g+=E,d-=8);if(a===0)a=1-y;else{if(a===h)return u?NaN:(w?-1:1)*(1/0);u=u+Math.pow(2,t),a=a-y}return(w?-1:1)*u*Math.pow(2,a-t)};di.write=function(n,i,e,t,s,a){var u,l,h,y=a*8-s-1,d=(1<<y)-1,g=d>>1,E=s===23?Math.pow(2,-24)-Math.pow(2,-77):0,w=t?0:a-1,A=t?1:-1,v=i<0||i===0&&1/i<0?1:0;for(i=Math.abs(i),isNaN(i)||i===1/0?(l=isNaN(i)?1:0,u=d):(u=Math.floor(Math.log(i)/Math.LN2),i*(h=Math.pow(2,-u))<1&&(u--,h*=2),u+g>=1?i+=E/h:i+=E*Math.pow(2,1-g),i*h>=2&&(u++,h/=2),u+g>=d?(l=0,u=d):u+g>=1?(l=(i*h-1)*Math.pow(2,s),u=u+g):(l=i*Math.pow(2,g-1)*Math.pow(2,s),u=0));s>=8;n[e+w]=l&255,w+=A,l/=256,s-=8);for(u=u<<s|l,y+=s;y>0;n[e+w]=u&255,w+=A,u/=256,y-=8);n[e+w-A]|=v*128};/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */(function(n){const i=Ne,e=di,t=typeof Symbol=="function"&&typeof Symbol.for=="function"?Symbol.for("nodejs.util.inspect.custom"):null;n.Buffer=l,n.SlowBuffer=j,n.INSPECT_MAX_BYTES=50;const s=2147483647;n.kMaxLength=s,l.TYPED_ARRAY_SUPPORT=a(),!l.TYPED_ARRAY_SUPPORT&&typeof console<"u"&&typeof console.error=="function"&&console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support.");function a(){try{const c=new Uint8Array(1),r={foo:function(){return 42}};return Object.setPrototypeOf(r,Uint8Array.prototype),Object.setPrototypeOf(c,r),c.foo()===42}catch{return!1}}Object.defineProperty(l.prototype,"parent",{enumerable:!0,get:function(){if(!!l.isBuffer(this))return this.buffer}}),Object.defineProperty(l.prototype,"offset",{enumerable:!0,get:function(){if(!!l.isBuffer(this))return this.byteOffset}});function u(c){if(c>s)throw new RangeError('The value "'+c+'" is invalid for option "size"');const r=new Uint8Array(c);return Object.setPrototypeOf(r,l.prototype),r}function l(c,r,o){if(typeof c=="number"){if(typeof r=="string")throw new TypeError('The "string" argument must be of type string. Received type number');return g(c)}return h(c,r,o)}l.poolSize=8192;function h(c,r,o){if(typeof c=="string")return E(c,r);if(ArrayBuffer.isView(c))return A(c);if(c==null)throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof c);if(an(c,ArrayBuffer)||c&&an(c.buffer,ArrayBuffer)||typeof SharedArrayBuffer<"u"&&(an(c,SharedArrayBuffer)||c&&an(c.buffer,SharedArrayBuffer)))return v(c,r,o);if(typeof c=="number")throw new TypeError('The "value" argument must not be of type number. Received type number');const f=c.valueOf&&c.valueOf();if(f!=null&&f!==c)return l.from(f,r,o);const p=S(c);if(p)return p;if(typeof Symbol<"u"&&Symbol.toPrimitive!=null&&typeof c[Symbol.toPrimitive]=="function")return l.from(c[Symbol.toPrimitive]("string"),r,o);throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof c)}l.from=function(c,r,o){return h(c,r,o)},Object.setPrototypeOf(l.prototype,Uint8Array.prototype),Object.setPrototypeOf(l,Uint8Array);function y(c){if(typeof c!="number")throw new TypeError('"size" argument must be of type number');if(c<0)throw new RangeError('The value "'+c+'" is invalid for option "size"')}function d(c,r,o){return y(c),c<=0?u(c):r!==void 0?typeof o=="string"?u(c).fill(r,o):u(c).fill(r):u(c)}l.alloc=function(c,r,o){return d(c,r,o)};function g(c){return y(c),u(c<0?0:k(c)|0)}l.allocUnsafe=function(c){return g(c)},l.allocUnsafeSlow=function(c){return g(c)};function E(c,r){if((typeof r!="string"||r==="")&&(r="utf8"),!l.isEncoding(r))throw new TypeError("Unknown encoding: "+r);const o=T(c,r)|0;let f=u(o);const p=f.write(c,r);return p!==o&&(f=f.slice(0,p)),f}function w(c){const r=c.length<0?0:k(c.length)|0,o=u(r);for(let f=0;f<r;f+=1)o[f]=c[f]&255;return o}function A(c){if(an(c,Uint8Array)){const r=new Uint8Array(c);return v(r.buffer,r.byteOffset,r.byteLength)}return w(c)}function v(c,r,o){if(r<0||c.byteLength<r)throw new RangeError('"offset" is outside of buffer bounds');if(c.byteLength<r+(o||0))throw new RangeError('"length" is outside of buffer bounds');let f;return r===void 0&&o===void 0?f=new Uint8Array(c):o===void 0?f=new Uint8Array(c,r):f=new Uint8Array(c,r,o),Object.setPrototypeOf(f,l.prototype),f}function S(c){if(l.isBuffer(c)){const r=k(c.length)|0,o=u(r);return o.length===0||c.copy(o,0,0,r),o}if(c.length!==void 0)return typeof c.length!="number"||Ye(c.length)?u(0):w(c);if(c.type==="Buffer"&&Array.isArray(c.data))return w(c.data)}function k(c){if(c>=s)throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x"+s.toString(16)+" bytes");return c|0}function j(c){return+c!=c&&(c=0),l.alloc(+c)}l.isBuffer=function(r){return r!=null&&r._isBuffer===!0&&r!==l.prototype},l.compare=function(r,o){if(an(r,Uint8Array)&&(r=l.from(r,r.offset,r.byteLength)),an(o,Uint8Array)&&(o=l.from(o,o.offset,o.byteLength)),!l.isBuffer(r)||!l.isBuffer(o))throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');if(r===o)return 0;let f=r.length,p=o.length;for(let x=0,b=Math.min(f,p);x<b;++x)if(r[x]!==o[x]){f=r[x],p=o[x];break}return f<p?-1:p<f?1:0},l.isEncoding=function(r){switch(String(r).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"latin1":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return!0;default:return!1}},l.concat=function(r,o){if(!Array.isArray(r))throw new TypeError('"list" argument must be an Array of Buffers');if(r.length===0)return l.alloc(0);let f;if(o===void 0)for(o=0,f=0;f<r.length;++f)o+=r[f].length;const p=l.allocUnsafe(o);let x=0;for(f=0;f<r.length;++f){let b=r[f];if(an(b,Uint8Array))x+b.length>p.length?(l.isBuffer(b)||(b=l.from(b)),b.copy(p,x)):Uint8Array.prototype.set.call(p,b,x);else if(l.isBuffer(b))b.copy(p,x);else throw new TypeError('"list" argument must be an Array of Buffers');x+=b.length}return p};function T(c,r){if(l.isBuffer(c))return c.length;if(ArrayBuffer.isView(c)||an(c,ArrayBuffer))return c.byteLength;if(typeof c!="string")throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type '+typeof c);const o=c.length,f=arguments.length>2&&arguments[2]===!0;if(!f&&o===0)return 0;let p=!1;for(;;)switch(r){case"ascii":case"latin1":case"binary":return o;case"utf8":case"utf-8":return ze(c).length;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return o*2;case"hex":return o>>>1;case"base64":return Ni(c).length;default:if(p)return f?-1:ze(c).length;r=(""+r).toLowerCase(),p=!0}}l.byteLength=T;function nn(c,r,o){let f=!1;if((r===void 0||r<0)&&(r=0),r>this.length||((o===void 0||o>this.length)&&(o=this.length),o<=0)||(o>>>=0,r>>>=0,o<=r))return"";for(c||(c="utf8");;)switch(c){case"hex":return Vr(this,r,o);case"utf8":case"utf-8":return _i(this,r,o);case"ascii":return qr(this,r,o);case"latin1":case"binary":return Gr(this,r,o);case"base64":return jr(this,r,o);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return Kr(this,r,o);default:if(f)throw new TypeError("Unknown encoding: "+c);c=(c+"").toLowerCase(),f=!0}}l.prototype._isBuffer=!0;function D(c,r,o){const f=c[r];c[r]=c[o],c[o]=f}l.prototype.swap16=function(){const r=this.length;if(r%2!==0)throw new RangeError("Buffer size must be a multiple of 16-bits");for(let o=0;o<r;o+=2)D(this,o,o+1);return this},l.prototype.swap32=function(){const r=this.length;if(r%4!==0)throw new RangeError("Buffer size must be a multiple of 32-bits");for(let o=0;o<r;o+=4)D(this,o,o+3),D(this,o+1,o+2);return this},l.prototype.swap64=function(){const r=this.length;if(r%8!==0)throw new RangeError("Buffer size must be a multiple of 64-bits");for(let o=0;o<r;o+=8)D(this,o,o+7),D(this,o+1,o+6),D(this,o+2,o+5),D(this,o+3,o+4);return this},l.prototype.toString=function(){const r=this.length;return r===0?"":arguments.length===0?_i(this,0,r):nn.apply(this,arguments)},l.prototype.toLocaleString=l.prototype.toString,l.prototype.equals=function(r){if(!l.isBuffer(r))throw new TypeError("Argument must be a Buffer");return this===r?!0:l.compare(this,r)===0},l.prototype.inspect=function(){let r="";const o=n.INSPECT_MAX_BYTES;return r=this.toString("hex",0,o).replace(/(.{2})/g,"$1 ").trim(),this.length>o&&(r+=" ... "),"<Buffer "+r+">"},t&&(l.prototype[t]=l.prototype.inspect),l.prototype.compare=function(r,o,f,p,x){if(an(r,Uint8Array)&&(r=l.from(r,r.offset,r.byteLength)),!l.isBuffer(r))throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type '+typeof r);if(o===void 0&&(o=0),f===void 0&&(f=r?r.length:0),p===void 0&&(p=0),x===void 0&&(x=this.length),o<0||f>r.length||p<0||x>this.length)throw new RangeError("out of range index");if(p>=x&&o>=f)return 0;if(p>=x)return-1;if(o>=f)return 1;if(o>>>=0,f>>>=0,p>>>=0,x>>>=0,this===r)return 0;let b=x-p,I=f-o;const M=Math.min(b,I),O=this.slice(p,x),R=r.slice(o,f);for(let $=0;$<M;++$)if(O[$]!==R[$]){b=O[$],I=R[$];break}return b<I?-1:I<b?1:0};function dn(c,r,o,f,p){if(c.length===0)return-1;if(typeof o=="string"?(f=o,o=0):o>2147483647?o=2147483647:o<-2147483648&&(o=-2147483648),o=+o,Ye(o)&&(o=p?0:c.length-1),o<0&&(o=c.length+o),o>=c.length){if(p)return-1;o=c.length-1}else if(o<0)if(p)o=0;else return-1;if(typeof r=="string"&&(r=l.from(r,f)),l.isBuffer(r))return r.length===0?-1:Jn(c,r,o,f,p);if(typeof r=="number")return r=r&255,typeof Uint8Array.prototype.indexOf=="function"?p?Uint8Array.prototype.indexOf.call(c,r,o):Uint8Array.prototype.lastIndexOf.call(c,r,o):Jn(c,[r],o,f,p);throw new TypeError("val must be string, number or Buffer")}function Jn(c,r,o,f,p){let x=1,b=c.length,I=r.length;if(f!==void 0&&(f=String(f).toLowerCase(),f==="ucs2"||f==="ucs-2"||f==="utf16le"||f==="utf-16le")){if(c.length<2||r.length<2)return-1;x=2,b/=2,I/=2,o/=2}function M(R,$){return x===1?R[$]:R.readUInt16BE($*x)}let O;if(p){let R=-1;for(O=o;O<b;O++)if(M(c,O)===M(r,R===-1?0:O-R)){if(R===-1&&(R=O),O-R+1===I)return R*x}else R!==-1&&(O-=O-R),R=-1}else for(o+I>b&&(o=b-I),O=o;O>=0;O--){let R=!0;for(let $=0;$<I;$++)if(M(c,O+$)!==M(r,$)){R=!1;break}if(R)return O}return-1}l.prototype.includes=function(r,o,f){return this.indexOf(r,o,f)!==-1},l.prototype.indexOf=function(r,o,f){return dn(this,r,o,f,!0)},l.prototype.lastIndexOf=function(r,o,f){return dn(this,r,o,f,!1)};function Dr(c,r,o,f){o=Number(o)||0;const p=c.length-o;f?(f=Number(f),f>p&&(f=p)):f=p;const x=r.length;f>x/2&&(f=x/2);let b;for(b=0;b<f;++b){const I=parseInt(r.substr(b*2,2),16);if(Ye(I))return b;c[o+b]=I}return b}function Xr(c,r,o,f){return ge(ze(r,c.length-o),c,o,f)}function zr(c,r,o,f){return ge(nt(r),c,o,f)}function Yr(c,r,o,f){return ge(Ni(r),c,o,f)}function Hr(c,r,o,f){return ge(et(r,c.length-o),c,o,f)}l.prototype.write=function(r,o,f,p){if(o===void 0)p="utf8",f=this.length,o=0;else if(f===void 0&&typeof o=="string")p=o,f=this.length,o=0;else if(isFinite(o))o=o>>>0,isFinite(f)?(f=f>>>0,p===void 0&&(p="utf8")):(p=f,f=void 0);else throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");const x=this.length-o;if((f===void 0||f>x)&&(f=x),r.length>0&&(f<0||o<0)||o>this.length)throw new RangeError("Attempt to write outside buffer bounds");p||(p="utf8");let b=!1;for(;;)switch(p){case"hex":return Dr(this,r,o,f);case"utf8":case"utf-8":return Xr(this,r,o,f);case"ascii":case"latin1":case"binary":return zr(this,r,o,f);case"base64":return Yr(this,r,o,f);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return Hr(this,r,o,f);default:if(b)throw new TypeError("Unknown encoding: "+p);p=(""+p).toLowerCase(),b=!0}},l.prototype.toJSON=function(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}};function jr(c,r,o){return r===0&&o===c.length?i.fromByteArray(c):i.fromByteArray(c.slice(r,o))}function _i(c,r,o){o=Math.min(c.length,o);const f=[];let p=r;for(;p<o;){const x=c[p];let b=null,I=x>239?4:x>223?3:x>191?2:1;if(p+I<=o){let M,O,R,$;switch(I){case 1:x<128&&(b=x);break;case 2:M=c[p+1],(M&192)===128&&($=(x&31)<<6|M&63,$>127&&(b=$));break;case 3:M=c[p+1],O=c[p+2],(M&192)===128&&(O&192)===128&&($=(x&15)<<12|(M&63)<<6|O&63,$>2047&&($<55296||$>57343)&&(b=$));break;case 4:M=c[p+1],O=c[p+2],R=c[p+3],(M&192)===128&&(O&192)===128&&(R&192)===128&&($=(x&15)<<18|(M&63)<<12|(O&63)<<6|R&63,$>65535&&$<1114112&&(b=$))}}b===null?(b=65533,I=1):b>65535&&(b-=65536,f.push(b>>>10&1023|55296),b=56320|b&1023),f.push(b),p+=I}return Wr(f)}const Bi=4096;function Wr(c){const r=c.length;if(r<=Bi)return String.fromCharCode.apply(String,c);let o="",f=0;for(;f<r;)o+=String.fromCharCode.apply(String,c.slice(f,f+=Bi));return o}function qr(c,r,o){let f="";o=Math.min(c.length,o);for(let p=r;p<o;++p)f+=String.fromCharCode(c[p]&127);return f}function Gr(c,r,o){let f="";o=Math.min(c.length,o);for(let p=r;p<o;++p)f+=String.fromCharCode(c[p]);return f}function Vr(c,r,o){const f=c.length;(!r||r<0)&&(r=0),(!o||o<0||o>f)&&(o=f);let p="";for(let x=r;x<o;++x)p+=it[c[x]];return p}function Kr(c,r,o){const f=c.slice(r,o);let p="";for(let x=0;x<f.length-1;x+=2)p+=String.fromCharCode(f[x]+f[x+1]*256);return p}l.prototype.slice=function(r,o){const f=this.length;r=~~r,o=o===void 0?f:~~o,r<0?(r+=f,r<0&&(r=0)):r>f&&(r=f),o<0?(o+=f,o<0&&(o=0)):o>f&&(o=f),o<r&&(o=r);const p=this.subarray(r,o);return Object.setPrototypeOf(p,l.prototype),p};function X(c,r,o){if(c%1!==0||c<0)throw new RangeError("offset is not uint");if(c+r>o)throw new RangeError("Trying to access beyond buffer length")}l.prototype.readUintLE=l.prototype.readUIntLE=function(r,o,f){r=r>>>0,o=o>>>0,f||X(r,o,this.length);let p=this[r],x=1,b=0;for(;++b<o&&(x*=256);)p+=this[r+b]*x;return p},l.prototype.readUintBE=l.prototype.readUIntBE=function(r,o,f){r=r>>>0,o=o>>>0,f||X(r,o,this.length);let p=this[r+--o],x=1;for(;o>0&&(x*=256);)p+=this[r+--o]*x;return p},l.prototype.readUint8=l.prototype.readUInt8=function(r,o){return r=r>>>0,o||X(r,1,this.length),this[r]},l.prototype.readUint16LE=l.prototype.readUInt16LE=function(r,o){return r=r>>>0,o||X(r,2,this.length),this[r]|this[r+1]<<8},l.prototype.readUint16BE=l.prototype.readUInt16BE=function(r,o){return r=r>>>0,o||X(r,2,this.length),this[r]<<8|this[r+1]},l.prototype.readUint32LE=l.prototype.readUInt32LE=function(r,o){return r=r>>>0,o||X(r,4,this.length),(this[r]|this[r+1]<<8|this[r+2]<<16)+this[r+3]*16777216},l.prototype.readUint32BE=l.prototype.readUInt32BE=function(r,o){return r=r>>>0,o||X(r,4,this.length),this[r]*16777216+(this[r+1]<<16|this[r+2]<<8|this[r+3])},l.prototype.readBigUInt64LE=mn(function(r){r=r>>>0,Nn(r,"offset");const o=this[r],f=this[r+7];(o===void 0||f===void 0)&&Zn(r,this.length-8);const p=o+this[++r]*2**8+this[++r]*2**16+this[++r]*2**24,x=this[++r]+this[++r]*2**8+this[++r]*2**16+f*2**24;return BigInt(p)+(BigInt(x)<<BigInt(32))}),l.prototype.readBigUInt64BE=mn(function(r){r=r>>>0,Nn(r,"offset");const o=this[r],f=this[r+7];(o===void 0||f===void 0)&&Zn(r,this.length-8);const p=o*2**24+this[++r]*2**16+this[++r]*2**8+this[++r],x=this[++r]*2**24+this[++r]*2**16+this[++r]*2**8+f;return(BigInt(p)<<BigInt(32))+BigInt(x)}),l.prototype.readIntLE=function(r,o,f){r=r>>>0,o=o>>>0,f||X(r,o,this.length);let p=this[r],x=1,b=0;for(;++b<o&&(x*=256);)p+=this[r+b]*x;return x*=128,p>=x&&(p-=Math.pow(2,8*o)),p},l.prototype.readIntBE=function(r,o,f){r=r>>>0,o=o>>>0,f||X(r,o,this.length);let p=o,x=1,b=this[r+--p];for(;p>0&&(x*=256);)b+=this[r+--p]*x;return x*=128,b>=x&&(b-=Math.pow(2,8*o)),b},l.prototype.readInt8=function(r,o){return r=r>>>0,o||X(r,1,this.length),this[r]&128?(255-this[r]+1)*-1:this[r]},l.prototype.readInt16LE=function(r,o){r=r>>>0,o||X(r,2,this.length);const f=this[r]|this[r+1]<<8;return f&32768?f|4294901760:f},l.prototype.readInt16BE=function(r,o){r=r>>>0,o||X(r,2,this.length);const f=this[r+1]|this[r]<<8;return f&32768?f|4294901760:f},l.prototype.readInt32LE=function(r,o){return r=r>>>0,o||X(r,4,this.length),this[r]|this[r+1]<<8|this[r+2]<<16|this[r+3]<<24},l.prototype.readInt32BE=function(r,o){return r=r>>>0,o||X(r,4,this.length),this[r]<<24|this[r+1]<<16|this[r+2]<<8|this[r+3]},l.prototype.readBigInt64LE=mn(function(r){r=r>>>0,Nn(r,"offset");const o=this[r],f=this[r+7];(o===void 0||f===void 0)&&Zn(r,this.length-8);const p=this[r+4]+this[r+5]*2**8+this[r+6]*2**16+(f<<24);return(BigInt(p)<<BigInt(32))+BigInt(o+this[++r]*2**8+this[++r]*2**16+this[++r]*2**24)}),l.prototype.readBigInt64BE=mn(function(r){r=r>>>0,Nn(r,"offset");const o=this[r],f=this[r+7];(o===void 0||f===void 0)&&Zn(r,this.length-8);const p=(o<<24)+this[++r]*2**16+this[++r]*2**8+this[++r];return(BigInt(p)<<BigInt(32))+BigInt(this[++r]*2**24+this[++r]*2**16+this[++r]*2**8+f)}),l.prototype.readFloatLE=function(r,o){return r=r>>>0,o||X(r,4,this.length),e.read(this,r,!0,23,4)},l.prototype.readFloatBE=function(r,o){return r=r>>>0,o||X(r,4,this.length),e.read(this,r,!1,23,4)},l.prototype.readDoubleLE=function(r,o){return r=r>>>0,o||X(r,8,this.length),e.read(this,r,!0,52,8)},l.prototype.readDoubleBE=function(r,o){return r=r>>>0,o||X(r,8,this.length),e.read(this,r,!1,52,8)};function G(c,r,o,f,p,x){if(!l.isBuffer(c))throw new TypeError('"buffer" argument must be a Buffer instance');if(r>p||r<x)throw new RangeError('"value" argument is out of bounds');if(o+f>c.length)throw new RangeError("Index out of range")}l.prototype.writeUintLE=l.prototype.writeUIntLE=function(r,o,f,p){if(r=+r,o=o>>>0,f=f>>>0,!p){const I=Math.pow(2,8*f)-1;G(this,r,o,f,I,0)}let x=1,b=0;for(this[o]=r&255;++b<f&&(x*=256);)this[o+b]=r/x&255;return o+f},l.prototype.writeUintBE=l.prototype.writeUIntBE=function(r,o,f,p){if(r=+r,o=o>>>0,f=f>>>0,!p){const I=Math.pow(2,8*f)-1;G(this,r,o,f,I,0)}let x=f-1,b=1;for(this[o+x]=r&255;--x>=0&&(b*=256);)this[o+x]=r/b&255;return o+f},l.prototype.writeUint8=l.prototype.writeUInt8=function(r,o,f){return r=+r,o=o>>>0,f||G(this,r,o,1,255,0),this[o]=r&255,o+1},l.prototype.writeUint16LE=l.prototype.writeUInt16LE=function(r,o,f){return r=+r,o=o>>>0,f||G(this,r,o,2,65535,0),this[o]=r&255,this[o+1]=r>>>8,o+2},l.prototype.writeUint16BE=l.prototype.writeUInt16BE=function(r,o,f){return r=+r,o=o>>>0,f||G(this,r,o,2,65535,0),this[o]=r>>>8,this[o+1]=r&255,o+2},l.prototype.writeUint32LE=l.prototype.writeUInt32LE=function(r,o,f){return r=+r,o=o>>>0,f||G(this,r,o,4,4294967295,0),this[o+3]=r>>>24,this[o+2]=r>>>16,this[o+1]=r>>>8,this[o]=r&255,o+4},l.prototype.writeUint32BE=l.prototype.writeUInt32BE=function(r,o,f){return r=+r,o=o>>>0,f||G(this,r,o,4,4294967295,0),this[o]=r>>>24,this[o+1]=r>>>16,this[o+2]=r>>>8,this[o+3]=r&255,o+4};function Ti(c,r,o,f,p){Ri(r,f,p,c,o,7);let x=Number(r&BigInt(4294967295));c[o++]=x,x=x>>8,c[o++]=x,x=x>>8,c[o++]=x,x=x>>8,c[o++]=x;let b=Number(r>>BigInt(32)&BigInt(4294967295));return c[o++]=b,b=b>>8,c[o++]=b,b=b>>8,c[o++]=b,b=b>>8,c[o++]=b,o}function $i(c,r,o,f,p){Ri(r,f,p,c,o,7);let x=Number(r&BigInt(4294967295));c[o+7]=x,x=x>>8,c[o+6]=x,x=x>>8,c[o+5]=x,x=x>>8,c[o+4]=x;let b=Number(r>>BigInt(32)&BigInt(4294967295));return c[o+3]=b,b=b>>8,c[o+2]=b,b=b>>8,c[o+1]=b,b=b>>8,c[o]=b,o+8}l.prototype.writeBigUInt64LE=mn(function(r,o=0){return Ti(this,r,o,BigInt(0),BigInt("0xffffffffffffffff"))}),l.prototype.writeBigUInt64BE=mn(function(r,o=0){return $i(this,r,o,BigInt(0),BigInt("0xffffffffffffffff"))}),l.prototype.writeIntLE=function(r,o,f,p){if(r=+r,o=o>>>0,!p){const M=Math.pow(2,8*f-1);G(this,r,o,f,M-1,-M)}let x=0,b=1,I=0;for(this[o]=r&255;++x<f&&(b*=256);)r<0&&I===0&&this[o+x-1]!==0&&(I=1),this[o+x]=(r/b>>0)-I&255;return o+f},l.prototype.writeIntBE=function(r,o,f,p){if(r=+r,o=o>>>0,!p){const M=Math.pow(2,8*f-1);G(this,r,o,f,M-1,-M)}let x=f-1,b=1,I=0;for(this[o+x]=r&255;--x>=0&&(b*=256);)r<0&&I===0&&this[o+x+1]!==0&&(I=1),this[o+x]=(r/b>>0)-I&255;return o+f},l.prototype.writeInt8=function(r,o,f){return r=+r,o=o>>>0,f||G(this,r,o,1,127,-128),r<0&&(r=255+r+1),this[o]=r&255,o+1},l.prototype.writeInt16LE=function(r,o,f){return r=+r,o=o>>>0,f||G(this,r,o,2,32767,-32768),this[o]=r&255,this[o+1]=r>>>8,o+2},l.prototype.writeInt16BE=function(r,o,f){return r=+r,o=o>>>0,f||G(this,r,o,2,32767,-32768),this[o]=r>>>8,this[o+1]=r&255,o+2},l.prototype.writeInt32LE=function(r,o,f){return r=+r,o=o>>>0,f||G(this,r,o,4,2147483647,-2147483648),this[o]=r&255,this[o+1]=r>>>8,this[o+2]=r>>>16,this[o+3]=r>>>24,o+4},l.prototype.writeInt32BE=function(r,o,f){return r=+r,o=o>>>0,f||G(this,r,o,4,2147483647,-2147483648),r<0&&(r=4294967295+r+1),this[o]=r>>>24,this[o+1]=r>>>16,this[o+2]=r>>>8,this[o+3]=r&255,o+4},l.prototype.writeBigInt64LE=mn(function(r,o=0){return Ti(this,r,o,-BigInt("0x8000000000000000"),BigInt("0x7fffffffffffffff"))}),l.prototype.writeBigInt64BE=mn(function(r,o=0){return $i(this,r,o,-BigInt("0x8000000000000000"),BigInt("0x7fffffffffffffff"))});function ki(c,r,o,f,p,x){if(o+f>c.length)throw new RangeError("Index out of range");if(o<0)throw new RangeError("Index out of range")}function Li(c,r,o,f,p){return r=+r,o=o>>>0,p||ki(c,r,o,4),e.write(c,r,o,f,23,4),o+4}l.prototype.writeFloatLE=function(r,o,f){return Li(this,r,o,!0,f)},l.prototype.writeFloatBE=function(r,o,f){return Li(this,r,o,!1,f)};function Oi(c,r,o,f,p){return r=+r,o=o>>>0,p||ki(c,r,o,8),e.write(c,r,o,f,52,8),o+8}l.prototype.writeDoubleLE=function(r,o,f){return Oi(this,r,o,!0,f)},l.prototype.writeDoubleBE=function(r,o,f){return Oi(this,r,o,!1,f)},l.prototype.copy=function(r,o,f,p){if(!l.isBuffer(r))throw new TypeError("argument should be a Buffer");if(f||(f=0),!p&&p!==0&&(p=this.length),o>=r.length&&(o=r.length),o||(o=0),p>0&&p<f&&(p=f),p===f||r.length===0||this.length===0)return 0;if(o<0)throw new RangeError("targetStart out of bounds");if(f<0||f>=this.length)throw new RangeError("Index out of range");if(p<0)throw new RangeError("sourceEnd out of bounds");p>this.length&&(p=this.length),r.length-o<p-f&&(p=r.length-o+f);const x=p-f;return this===r&&typeof Uint8Array.prototype.copyWithin=="function"?this.copyWithin(o,f,p):Uint8Array.prototype.set.call(r,this.subarray(f,p),o),x},l.prototype.fill=function(r,o,f,p){if(typeof r=="string"){if(typeof o=="string"?(p=o,o=0,f=this.length):typeof f=="string"&&(p=f,f=this.length),p!==void 0&&typeof p!="string")throw new TypeError("encoding must be a string");if(typeof p=="string"&&!l.isEncoding(p))throw new TypeError("Unknown encoding: "+p);if(r.length===1){const b=r.charCodeAt(0);(p==="utf8"&&b<128||p==="latin1")&&(r=b)}}else typeof r=="number"?r=r&255:typeof r=="boolean"&&(r=Number(r));if(o<0||this.length<o||this.length<f)throw new RangeError("Out of range index");if(f<=o)return this;o=o>>>0,f=f===void 0?this.length:f>>>0,r||(r=0);let x;if(typeof r=="number")for(x=o;x<f;++x)this[x]=r;else{const b=l.isBuffer(r)?r:l.from(r,p),I=b.length;if(I===0)throw new TypeError('The value "'+r+'" is invalid for argument "value"');for(x=0;x<f-o;++x)this[x+o]=b[x%I]}return this};const Rn={};function Xe(c,r,o){Rn[c]=class extends o{constructor(){super(),Object.defineProperty(this,"message",{value:r.apply(this,arguments),writable:!0,configurable:!0}),this.name=`${this.name} [${c}]`,this.stack,delete this.name}get code(){return c}set code(p){Object.defineProperty(this,"code",{configurable:!0,enumerable:!0,value:p,writable:!0})}toString(){return`${this.name} [${c}]: ${this.message}`}}}Xe("ERR_BUFFER_OUT_OF_BOUNDS",function(c){return c?`${c} is outside of buffer bounds`:"Attempt to access memory outside buffer bounds"},RangeError),Xe("ERR_INVALID_ARG_TYPE",function(c,r){return`The "${c}" argument must be of type number. Received type ${typeof r}`},TypeError),Xe("ERR_OUT_OF_RANGE",function(c,r,o){let f=`The value of "${c}" is out of range.`,p=o;return Number.isInteger(o)&&Math.abs(o)>2**32?p=Mi(String(o)):typeof o=="bigint"&&(p=String(o),(o>BigInt(2)**BigInt(32)||o<-(BigInt(2)**BigInt(32)))&&(p=Mi(p)),p+="n"),f+=` It must be ${r}. Received ${p}`,f},RangeError);function Mi(c){let r="",o=c.length;const f=c[0]==="-"?1:0;for(;o>=f+4;o-=3)r=`_${c.slice(o-3,o)}${r}`;return`${c.slice(0,o)}${r}`}function Qr(c,r,o){Nn(r,"offset"),(c[r]===void 0||c[r+o]===void 0)&&Zn(r,c.length-(o+1))}function Ri(c,r,o,f,p,x){if(c>o||c<r){const b=typeof r=="bigint"?"n":"";let I;throw x>3?r===0||r===BigInt(0)?I=`>= 0${b} and < 2${b} ** ${(x+1)*8}${b}`:I=`>= -(2${b} ** ${(x+1)*8-1}${b}) and < 2 ** ${(x+1)*8-1}${b}`:I=`>= ${r}${b} and <= ${o}${b}`,new Rn.ERR_OUT_OF_RANGE("value",I,c)}Qr(f,p,x)}function Nn(c,r){if(typeof c!="number")throw new Rn.ERR_INVALID_ARG_TYPE(r,"number",c)}function Zn(c,r,o){throw Math.floor(c)!==c?(Nn(c,o),new Rn.ERR_OUT_OF_RANGE(o||"offset","an integer",c)):r<0?new Rn.ERR_BUFFER_OUT_OF_BOUNDS:new Rn.ERR_OUT_OF_RANGE(o||"offset",`>= ${o?1:0} and <= ${r}`,c)}const Jr=/[^+/0-9A-Za-z-_]/g;function Zr(c){if(c=c.split("=")[0],c=c.trim().replace(Jr,""),c.length<2)return"";for(;c.length%4!==0;)c=c+"=";return c}function ze(c,r){r=r||1/0;let o;const f=c.length;let p=null;const x=[];for(let b=0;b<f;++b){if(o=c.charCodeAt(b),o>55295&&o<57344){if(!p){if(o>56319){(r-=3)>-1&&x.push(239,191,189);continue}else if(b+1===f){(r-=3)>-1&&x.push(239,191,189);continue}p=o;continue}if(o<56320){(r-=3)>-1&&x.push(239,191,189),p=o;continue}o=(p-55296<<10|o-56320)+65536}else p&&(r-=3)>-1&&x.push(239,191,189);if(p=null,o<128){if((r-=1)<0)break;x.push(o)}else if(o<2048){if((r-=2)<0)break;x.push(o>>6|192,o&63|128)}else if(o<65536){if((r-=3)<0)break;x.push(o>>12|224,o>>6&63|128,o&63|128)}else if(o<1114112){if((r-=4)<0)break;x.push(o>>18|240,o>>12&63|128,o>>6&63|128,o&63|128)}else throw new Error("Invalid code point")}return x}function nt(c){const r=[];for(let o=0;o<c.length;++o)r.push(c.charCodeAt(o)&255);return r}function et(c,r){let o,f,p;const x=[];for(let b=0;b<c.length&&!((r-=2)<0);++b)o=c.charCodeAt(b),f=o>>8,p=o%256,x.push(p),x.push(f);return x}function Ni(c){return i.toByteArray(Zr(c))}function ge(c,r,o,f){let p;for(p=0;p<f&&!(p+o>=r.length||p>=c.length);++p)r[p+o]=c[p];return p}function an(c,r){return c instanceof r||c!=null&&c.constructor!=null&&c.constructor.name!=null&&c.constructor.name===r.name}function Ye(c){return c!==c}const it=function(){const c="0123456789abcdef",r=new Array(256);for(let o=0;o<16;++o){const f=o*16;for(let p=0;p<16;++p)r[f+p]=c[o]+c[p]}return r}();function mn(c){return typeof BigInt>"u"?rt:c}function rt(){throw new Error("BigInt not supported")}})(rr);var Ce=rr.Buffer,Io=z,mi=`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;function _o(n){if(n===null)return!1;var i,e,t=0,s=n.length,a=mi;for(e=0;e<s;e++)if(i=a.indexOf(n.charAt(e)),!(i>64)){if(i<0)return!1;t+=6}return t%8===0}function Bo(n){var i,e,t=n.replace(/[\r\n=]/g,""),s=t.length,a=mi,u=0,l=[];for(i=0;i<s;i++)i%4===0&&i&&(l.push(u>>16&255),l.push(u>>8&255),l.push(u&255)),u=u<<6|a.indexOf(t.charAt(i));return e=s%4*6,e===0?(l.push(u>>16&255),l.push(u>>8&255),l.push(u&255)):e===18?(l.push(u>>10&255),l.push(u>>2&255)):e===12&&l.push(u>>4&255),Ce?new Ce(l):l}function To(n){var i="",e=0,t,s,a=n.length,u=mi;for(t=0;t<a;t++)t%3===0&&t&&(i+=u[e>>18&63],i+=u[e>>12&63],i+=u[e>>6&63],i+=u[e&63]),e=(e<<8)+n[t];return s=a%3,s===0?(i+=u[e>>18&63],i+=u[e>>12&63],i+=u[e>>6&63],i+=u[e&63]):s===2?(i+=u[e>>10&63],i+=u[e>>4&63],i+=u[e<<2&63],i+=u[64]):s===1&&(i+=u[e>>2&63],i+=u[e<<4&63],i+=u[64],i+=u[64]),i}function $o(n){return Ce&&Ce.isBuffer(n)}var ko=new Io.Type("tag:yaml.org,2002:binary",{kind:"scalar",resolve:_o,construct:Bo,predicate:$o,represent:To}),Lo=z,Oo=Object.prototype.hasOwnProperty,Mo=Object.prototype.toString;function Ro(n){if(n===null)return!0;var i=[],e,t,s,a,u,l=n;for(e=0,t=l.length;e<t;e+=1){if(s=l[e],u=!1,Mo.call(s)!=="[object Object]")return!1;for(a in s)if(Oo.call(s,a))if(!u)u=!0;else return!1;if(!u)return!1;if(i.indexOf(a)===-1)i.push(a);else return!1}return!0}function No(n){return n!==null?n:[]}var Po=new Lo.Type("tag:yaml.org,2002:omap",{kind:"sequence",resolve:Ro,construct:No}),Uo=z,Je=de,Do=Object.prototype.toString;function Xo(n){if(n===null)return!0;if(n.kind!=Je.Kind.SEQ)return!1;var i,e,t,s=n.items;for(i=0,e=s.length;i<e;i+=1)if(t=s[i],Do.call(t)!=="[object Object]"||!Array.isArray(t.mappings)||t.mappings.length!==1)return!1;return!0}function zo(n){if(n===null||!Array.isArray(n.items))return[];var i,e,t,s=n.items;for(t=Je.newItems(),t.parent=n.parent,t.startPosition=n.startPosition,t.endPosition=n.endPosition,i=0,e=s.length;i<e;i+=1){var a=s[i],u=a.mappings[0],l=Je.newItems();l.parent=t,l.startPosition=u.key.startPosition,l.endPosition=u.value.startPosition,u.key.parent=l,u.value.parent=l,l.items=[u.key,u.value],t.items.push(l)}return t}var Yo=new Uo.Type("tag:yaml.org,2002:pairs",{kind:"sequence",resolve:Xo,construct:zo}),Ho=z,jo=de;function Wo(n){return n===null?!0:n.kind==jo.Kind.MAP}function qo(n){return n!==null?n:{}}var Go=new Ho.Type("tag:yaml.org,2002:set",{kind:"mapping",resolve:Wo,construct:qo}),Vo=Mn,Ko=new Vo.Schema({include:[uo],implicit:[mo,go],explicit:[ko,Po,Yo,Go]}),yi=Ko,Qo=z;function Jo(){return!0}function Zo(){}function ns(){return""}function es(n){return typeof n>"u"}var is=new Qo.Type("tag:yaml.org,2002:js/undefined",{kind:"scalar",resolve:Jo,construct:Zo,predicate:es,represent:ns}),rs=z;function ts(n){if(n===null||n.length===0)return!1;var i=n,e=/\/([gim]*)$/.exec(n),t="";if(i[0]==="/"){if(e&&(t=e[1]),t.length>3||i[i.length-t.length-1]!=="/")return!1;i=i.slice(1,i.length-t.length-1)}try{var s=new RegExp(i,t);return!0}catch{return!1}}function os(n){var i=n,e=/\/([gim]*)$/.exec(n),t="";return i[0]==="/"&&(e&&(t=e[1]),i=i.slice(1,i.length-t.length-1)),new RegExp(i,t)}function ss(n){var i="/"+n.source+"/";return n.global&&(i+="g"),n.multiline&&(i+="m"),n.ignoreCase&&(i+="i"),i}function ls(n){return Object.prototype.toString.call(n)==="[object RegExp]"}var as=new rs.Type("tag:yaml.org,2002:js/regexp",{kind:"scalar",resolve:ts,construct:os,predicate:ls,represent:ss}),or=Mn,sr=new or.Schema({include:[yi],explicit:[is,as]});or.Schema.DEFAULT=sr;var lr=sr;Object.defineProperty(hn,"__esModule",{value:!0});var J=de,xn=Z,xi=me,gi=gt,ar=yi,us=lr,Pe=Object.prototype.hasOwnProperty,Fe=1,ur=2,cr=3,Se=4,We=1,cs=2,Yi=3,fs=/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/,hs=/[\x85\u2028\u2029]/,ps=/[,\[\]\{\}]/,fr=/^(?:!|!!|![a-z\-]+!)$/i,hr=/^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;function sn(n){return n===10||n===13}function Ln(n){return n===9||n===32}function K(n){return n===9||n===32||n===10||n===13}function Dn(n){return n===44||n===91||n===93||n===123||n===125}function ds(n){var i;return 48<=n&&n<=57?n-48:(i=n|32,97<=i&&i<=102?i-97+10:-1)}function ms(n){return n===120?2:n===117?4:n===85?8:0}function ys(n){return 48<=n&&n<=57?n-48:-1}function xs(n){return n===48?"\0":n===97?"\x07":n===98?"\b":n===116||n===9?"	":n===110?`
`:n===118?"\v":n===102?"\f":n===114?"\r":n===101?"\x1B":n===32?" ":n===34?'"':n===47?"/":n===92?"\\":n===78?"\x85":n===95?"\xA0":n===76?"\u2028":n===80?"\u2029":""}function gs(n){return n<=65535?String.fromCharCode(n):String.fromCharCode((n-65536>>10)+55296,(n-65536&1023)+56320)}var Ze=new Array(256),ni=new Array(256),pr=new Array(256),ei=new Array(256);for(var tn=0;tn<256;tn++)ei[tn]=ni[tn]=xs(tn),Ze[tn]=ni[tn]?1:0,pr[tn]=1,Ze[tn]||(ei[tn]="\\"+String.fromCharCode(tn));var ws=function(){function n(i,e){this.errorMap={},this.errors=[],this.lines=[],this.input=i,this.filename=e.filename||null,this.schema=e.schema||us,this.onWarning=e.onWarning||null,this.legacy=e.legacy||!1,this.allowAnyEscape=e.allowAnyEscape||!1,this.ignoreDuplicateKeys=e.ignoreDuplicateKeys||!1,this.implicitTypes=this.schema.compiledImplicit,this.typeMap=this.schema.compiledTypeMap,this.length=i.length,this.position=0,this.line=0,this.lineStart=0,this.lineIndent=0,this.documents=[]}return n}();function wi(n,i,e){return e===void 0&&(e=!1),new xi(i,new gi(n.filename,n.input,n.position,n.line,n.position-n.lineStart),e)}function ii(n,i,e,t,s){t===void 0&&(t=!1),s===void 0&&(s=!1);var a=bs(n,i);if(!!a){var u=e+i;if(!n.errorMap[u]){var l=new gi(n.filename,n.input,i,a.line,i-a.start);s&&(l.toLineEnd=!0);var h=new xi(e,l,t);n.errors.push(h)}}}function F(n,i){var e=wi(n,i),t=e.message+e.mark.position;if(!n.errorMap[t]){n.errors.push(e),n.errorMap[t]=1;for(var s=n.position;;){if(n.position>=n.input.length-1)return;var a=n.input.charAt(n.position);if(a==`
`){n.position--,n.position==s&&(n.position+=1);return}if(a=="\r"){n.position--,n.position==s&&(n.position+=1);return}n.position++}}}function ri(n,i){var e=wi(n,i);n.onWarning&&n.onWarning.call(null,e)}var Hi={YAML:function(i,e,t){var s,a,u;i.version!==null&&F(i,"duplication of %YAML directive"),t.length!==1&&F(i,"YAML directive accepts exactly one argument"),s=/^([0-9]+)\.([0-9]+)$/.exec(t[0]),s===null&&F(i,"ill-formed argument of the YAML directive"),a=parseInt(s[1],10),u=parseInt(s[2],10),a!==1&&F(i,"found incompatible YAML document (version 1.2 is required)"),i.version=t[0],i.checkLineBreaks=u<2,u!==2&&F(i,"found incompatible YAML document (version 1.2 is required)")},TAG:function(i,e,t){var s,a;t.length!==2&&F(i,"TAG directive accepts exactly two arguments"),s=t[0],a=t[1],fr.test(s)||F(i,"ill-formed tag handle (first argument) of the TAG directive"),Pe.call(i.tagMap,s)&&F(i,'there is a previously declared suffix for "'+s+'" tag handle'),hr.test(a)||F(i,"ill-formed tag prefix (second argument) of the TAG directive"),i.tagMap[s]=a}};function vn(n,i,e,t){var s,a,u,l,h=n.result;if(h.startPosition==-1&&(h.startPosition=i),i<=e){if(l=n.input.slice(i,e),t)for(s=0,a=l.length;s<a;s+=1)u=l.charCodeAt(s),u===9||32<=u&&u<=1114111||F(n,"expected valid JSON character");else fs.test(l)&&F(n,"the stream contains non-printable characters");h.value+=l,h.endPosition=e}}function Xn(n,i,e,t,s){if(t!=null){i===null&&(i={startPosition:t.startPosition,endPosition:s.endPosition,parent:null,errors:[],mappings:[],kind:J.Kind.MAP});var a=J.newMapping(t,s);return a.parent=i,t.parent=a,s!=null&&(s.parent=a),!n.ignoreDuplicateKeys&&i.mappings.forEach(function(u){u.key&&u.key.value===(a.key&&a.key.value)&&(ii(n,a.key.startPosition,"duplicate key"),ii(n,u.key.startPosition,"duplicate key"))}),i.mappings.push(a),i.endPosition=s?s.endPosition:t.endPosition+1,i}}function bi(n){var i;i=n.input.charCodeAt(n.position),i===10?n.position++:i===13?(n.position++,n.input.charCodeAt(n.position)===10&&n.position++):F(n,"a line break is expected"),n.line+=1,n.lineStart=n.position,n.lines.push({start:n.lineStart,line:n.line})}function bs(n,i){for(var e,t=0;t<n.lines.length&&!(n.lines[t].start>i);t++)e=n.lines[t];return e||{start:0,line:0}}function P(n,i,e){for(var t=0,s=n.input.charCodeAt(n.position);s!==0;){for(;Ln(s);)s===9&&n.errors.push(wi(n,"Using tabs can lead to unpredictable results",!0)),s=n.input.charCodeAt(++n.position);if(i&&s===35)do s=n.input.charCodeAt(++n.position);while(s!==10&&s!==13&&s!==0);if(sn(s))for(bi(n),s=n.input.charCodeAt(n.position),t++,n.lineIndent=0;s===32;)n.lineIndent++,s=n.input.charCodeAt(++n.position);else break}return e!==-1&&t!==0&&n.lineIndent<e&&ri(n,"deficient indentation"),t}function ye(n){var i=n.position,e;return e=n.input.charCodeAt(i),!!((e===45||e===46)&&n.input.charCodeAt(i+1)===e&&n.input.charCodeAt(i+2)===e&&(i+=3,e=n.input.charCodeAt(i),e===0||K(e)))}function Ei(n,i,e){e===1?i.value+=" ":e>1&&(i.value+=xn.repeat(`
`,e-1))}function Es(n,i,e){var t,s,a,u,l,h,y,d,g=n.kind,E=n.result,w,A=J.newScalar();if(A.plainScalar=!0,n.result=A,w=n.input.charCodeAt(n.position),K(w)||Dn(w)||w===35||w===38||w===42||w===33||w===124||w===62||w===39||w===34||w===37||w===64||w===96||(w===63||w===45)&&(s=n.input.charCodeAt(n.position+1),K(s)||e&&Dn(s)))return!1;for(n.kind="scalar",a=u=n.position,l=!1;w!==0;){if(w===58){if(s=n.input.charCodeAt(n.position+1),K(s)||e&&Dn(s))break}else if(w===35){if(t=n.input.charCodeAt(n.position-1),K(t))break}else{if(n.position===n.lineStart&&ye(n)||e&&Dn(w))break;if(sn(w))if(h=n.line,y=n.lineStart,d=n.lineIndent,P(n,!1,-1),n.lineIndent>=i){l=!0,w=n.input.charCodeAt(n.position);continue}else{n.position=u,n.line=h,n.lineStart=y,n.lineIndent=d;break}}if(l&&(vn(n,a,u,!1),Ei(n,A,n.line-h),a=u=n.position,l=!1),Ln(w)||(u=n.position+1),w=n.input.charCodeAt(++n.position),n.position>=n.input.length)return!1}return vn(n,a,u,!1),n.result.startPosition!=-1?(A.rawValue=n.input.substring(A.startPosition,A.endPosition),!0):(n.kind=g,n.result=E,!1)}function As(n,i){var e,t,s;if(e=n.input.charCodeAt(n.position),e!==39)return!1;var a=J.newScalar();for(a.singleQuoted=!0,n.kind="scalar",n.result=a,a.startPosition=n.position,n.position++,t=s=n.position;(e=n.input.charCodeAt(n.position))!==0;)if(e===39)if(vn(n,t,n.position,!0),e=n.input.charCodeAt(++n.position),a.endPosition=n.position,e===39)t=s=n.position,n.position++;else return!0;else sn(e)?(vn(n,t,s,!0),Ei(n,a,P(n,!1,i)),t=s=n.position):n.position===n.lineStart&&ye(n)?F(n,"unexpected end of the document within a single quoted scalar"):(n.position++,s=n.position,a.endPosition=n.position);F(n,"unexpected end of the stream within a single quoted scalar")}function vs(n,i){var e,t,s,a,u,l;if(l=n.input.charCodeAt(n.position),l!==34)return!1;n.kind="scalar";var h=J.newScalar();for(h.doubleQuoted=!0,n.result=h,h.startPosition=n.position,n.position++,e=t=n.position;(l=n.input.charCodeAt(n.position))!==0;){if(l===34)return vn(n,e,n.position,!0),n.position++,h.endPosition=n.position,h.rawValue=n.input.substring(h.startPosition,h.endPosition),!0;if(l===92){if(vn(n,e,n.position,!0),l=n.input.charCodeAt(++n.position),sn(l))P(n,!1,i);else if(l<256&&(n.allowAnyEscape?pr[l]:Ze[l]))h.value+=n.allowAnyEscape?ei[l]:ni[l],n.position++;else if((u=ms(l))>0){for(s=u,a=0;s>0;s--)l=n.input.charCodeAt(++n.position),(u=ds(l))>=0?a=(a<<4)+u:F(n,"expected hexadecimal character");h.value+=gs(a),n.position++}else F(n,"unknown escape sequence");e=t=n.position}else sn(l)?(vn(n,e,t,!0),Ei(n,h,P(n,!1,i)),e=t=n.position):n.position===n.lineStart&&ye(n)?F(n,"unexpected end of the document within a double quoted scalar"):(n.position++,t=n.position)}F(n,"unexpected end of the stream within a double quoted scalar")}function Cs(n,i){var e=!0,t,s=n.tag,a,u=n.anchor,l,h,y,d,g,E,w,A,v;if(v=n.input.charCodeAt(n.position),v===91)h=93,g=!1,a=J.newItems(),a.startPosition=n.position;else if(v===123)h=125,g=!0,a=J.newMap(),a.startPosition=n.position;else return!1;for(n.anchor!==null&&(a.anchorId=n.anchor,n.anchorMap[n.anchor]=a),v=n.input.charCodeAt(++n.position);v!==0;){if(P(n,!0,i),v=n.input.charCodeAt(n.position),v===h)return n.position++,n.tag=s,n.anchor=u,n.kind=g?"mapping":"sequence",n.result=a,a.endPosition=n.position,!0;if(!e){var S=n.position;F(n,"missed comma between flow collection entries"),n.position=S+1}if(w=E=A=null,y=d=!1,v===63&&(l=n.input.charCodeAt(n.position+1),K(l)&&(y=d=!0,n.position++,P(n,!0,i))),t=n.line,Kn(n,i,Fe,!1,!0),w=n.tag,E=n.result,P(n,!0,i),v=n.input.charCodeAt(n.position),(d||n.line===t)&&v===58&&(y=!0,v=n.input.charCodeAt(++n.position),P(n,!0,i),Kn(n,i,Fe,!1,!0),A=n.result),g)Xn(n,a,w,E,A);else if(y){var k=Xn(n,null,w,E,A);k.parent=a,a.items.push(k)}else E&&(E.parent=a),a.items.push(E);a.endPosition=n.position+1,P(n,!0,i),v=n.input.charCodeAt(n.position),v===44?(e=!0,v=n.input.charCodeAt(++n.position)):e=!1}F(n,"unexpected end of the stream within a flow collection")}function Fs(n,i){var e,t,s=We,a=!1,u=i,l=0,h=!1,y,d;if(d=n.input.charCodeAt(n.position),d===124)t=!1;else if(d===62)t=!0;else return!1;var g=J.newScalar();for(n.kind="scalar",n.result=g,g.startPosition=n.position;d!==0;)if(d=n.input.charCodeAt(++n.position),d===43||d===45)We===s?s=d===43?Yi:cs:F(n,"repeat of a chomping mode identifier");else if((y=ys(d))>=0)y===0?F(n,"bad explicit indentation width of a block scalar; it cannot be less than one"):a?F(n,"repeat of an indentation width identifier"):(u=i+y-1,a=!0);else break;if(Ln(d)){do d=n.input.charCodeAt(++n.position);while(Ln(d));if(d===35)do d=n.input.charCodeAt(++n.position);while(!sn(d)&&d!==0)}for(;d!==0;){for(bi(n),n.lineIndent=0,d=n.input.charCodeAt(n.position);(!a||n.lineIndent<u)&&d===32;)n.lineIndent++,d=n.input.charCodeAt(++n.position);if(!a&&n.lineIndent>u&&(u=n.lineIndent),sn(d)){l++;continue}if(n.lineIndent<u){s===Yi?g.value+=xn.repeat(`
`,l):s===We&&a&&(g.value+=`
`);break}for(t?Ln(d)?(h=!0,g.value+=xn.repeat(`
`,l+1)):h?(h=!1,g.value+=xn.repeat(`
`,l+1)):l===0?a&&(g.value+=" "):g.value+=xn.repeat(`
`,l):a&&(g.value+=xn.repeat(`
`,l+1)),a=!0,l=0,e=n.position;!sn(d)&&d!==0;)d=n.input.charCodeAt(++n.position);vn(n,e,n.position,!1)}g.endPosition=n.position;for(var E=n.position-1;;){var w=n.input[E];if(w=="\r"||w==`
`||w!=" "&&w!="	")break;E--}return g.endPosition=E,g.rawValue=n.input.substring(g.startPosition,g.endPosition),!0}function ji(n,i){var e,t=n.tag,s=n.anchor,a=J.newItems(),u,l=!1,h;for(n.anchor!==null&&(a.anchorId=n.anchor,n.anchorMap[n.anchor]=a),a.startPosition=n.position,h=n.input.charCodeAt(n.position);h!==0&&!(h!==45||(u=n.input.charCodeAt(n.position+1),!K(u)));){if(l=!0,n.position++,P(n,!0,-1)&&n.lineIndent<=i){a.items.push(null),h=n.input.charCodeAt(n.position);continue}if(e=n.line,Kn(n,i,cr,!1,!0),n.result&&(n.result.parent=a,a.items.push(n.result)),P(n,!0,-1),h=n.input.charCodeAt(n.position),(n.line===e||n.lineIndent>i)&&h!==0)F(n,"bad indentation of a sequence entry");else if(n.lineIndent<i)break}return a.endPosition=n.position,l?(n.tag=t,n.anchor=s,n.kind="sequence",n.result=a,a.endPosition=n.position,!0):!1}function Ss(n,i,e){var t,s,a,u=n.tag,l=n.anchor,h=J.newMap(),y=null,d=null,g=null,E=!1,w=!1,A;for(h.startPosition=n.position,n.anchor!==null&&(h.anchorId=n.anchor,n.anchorMap[n.anchor]=h),A=n.input.charCodeAt(n.position);A!==0;){if(t=n.input.charCodeAt(n.position+1),a=n.line,(A===63||A===58)&&K(t))A===63?(E&&(Xn(n,h,y,d,null),y=d=g=null),w=!0,E=!0,s=!0):E?(E=!1,s=!0):F(n,"incomplete explicit mapping pair; a key node is missed"),n.position+=1,A=t;else if(Kn(n,e,ur,!1,!0))if(n.line===a){for(A=n.input.charCodeAt(n.position);Ln(A);)A=n.input.charCodeAt(++n.position);if(A===58)A=n.input.charCodeAt(++n.position),K(A)||F(n,"a whitespace character is expected after the key-value separator within a block mapping"),E&&(Xn(n,h,y,d,null),y=d=g=null),w=!0,E=!1,s=!1,y=n.tag,d=n.result;else{if(n.position==n.lineStart&&ye(n))break;if(w)F(n,"can not read an implicit mapping pair; a colon is missed");else return n.tag=u,n.anchor=l,!0}}else if(w){for(F(n,"can not read a block mapping entry; a multiline key may not be an implicit key");n.position>0;)if(A=n.input.charCodeAt(--n.position),sn(A)){n.position++;break}}else return n.tag=u,n.anchor=l,!0;else break;if((n.line===a||n.lineIndent>i)&&(Kn(n,i,Se,!0,s)&&(E?d=n.result:g=n.result),E||(Xn(n,h,y,d,g),y=d=g=null),P(n,!0,-1),A=n.input.charCodeAt(n.position)),n.lineIndent>i&&A!==0)F(n,"bad indentation of a mapping entry");else if(n.lineIndent<i)break}return E&&Xn(n,h,y,d,null),w&&(n.tag=u,n.anchor=l,n.kind="mapping",n.result=h),w}function Is(n){var i,e=!1,t=!1,s,a,u;if(u=n.input.charCodeAt(n.position),u!==33)return!1;if(n.tag!==null&&F(n,"duplication of a tag property"),u=n.input.charCodeAt(++n.position),u===60?(e=!0,u=n.input.charCodeAt(++n.position)):u===33?(t=!0,s="!!",u=n.input.charCodeAt(++n.position)):s="!",i=n.position,e){do u=n.input.charCodeAt(++n.position);while(u!==0&&u!==62);n.position<n.length?(a=n.input.slice(i,n.position),u=n.input.charCodeAt(++n.position)):F(n,"unexpected end of the stream within a verbatim tag")}else{for(;u!==0&&!K(u);)u===33&&(t?F(n,"tag suffix cannot contain exclamation marks"):(s=n.input.slice(i-1,n.position+1),fr.test(s)||F(n,"named tag handle cannot contain such characters"),t=!0,i=n.position+1)),u=n.input.charCodeAt(++n.position);a=n.input.slice(i,n.position),ps.test(a)&&F(n,"tag suffix cannot contain flow indicator characters")}return a&&!hr.test(a)&&F(n,"tag name cannot contain such characters: "+a),e?n.tag=a:Pe.call(n.tagMap,s)?n.tag=n.tagMap[s]+a:s==="!"?n.tag="!"+a:s==="!!"?n.tag="tag:yaml.org,2002:"+a:F(n,'undeclared tag handle "'+s+'"'),!0}function _s(n){var i,e;if(e=n.input.charCodeAt(n.position),e!==38)return!1;for(n.anchor!==null&&F(n,"duplication of an anchor property"),e=n.input.charCodeAt(++n.position),i=n.position;e!==0&&!K(e)&&!Dn(e);)e=n.input.charCodeAt(++n.position);return n.position===i&&F(n,"name of an anchor node must contain at least one character"),n.anchor=n.input.slice(i,n.position),!0}function Bs(n){var i,e;n.length,n.input;var t;if(t=n.input.charCodeAt(n.position),t!==42)return!1;for(t=n.input.charCodeAt(++n.position),i=n.position;t!==0&&!K(t)&&!Dn(t);)t=n.input.charCodeAt(++n.position);return n.position<=i&&(F(n,"name of an alias node must contain at least one character"),n.position=i+1),e=n.input.slice(i,n.position),n.anchorMap.hasOwnProperty(e)||(F(n,'unidentified alias "'+e+'"'),n.position<=i&&(n.position=i+1)),n.result=J.newAnchorRef(e,i,n.position,n.anchorMap[e]),P(n,!0,-1),!0}function Kn(n,i,e,t,s){var a,u,l,h=1,y=!1,d=!1,g,E,w,A,v;n.tag=null,n.anchor=null,n.kind=null,n.result=null,a=u=l=Se===e||cr===e,t&&P(n,!0,-1)&&(y=!0,n.lineIndent>i?h=1:n.lineIndent===i?h=0:n.lineIndent<i&&(h=-1));var S=n.position;if(n.position-n.lineStart,h===1)for(;Is(n)||_s(n);)P(n,!0,-1)?(y=!0,l=a,n.lineIndent>i?h=1:n.lineIndent===i?h=0:n.lineIndent<i&&(h=-1)):l=!1;if(l&&(l=y||s),(h===1||Se===e)&&(Fe===e||ur===e?A=i:A=i+1,v=n.position-n.lineStart,h===1?l&&(ji(n,v)||Ss(n,v,A))||Cs(n,A)?d=!0:(u&&Fs(n,A)||As(n,A)||vs(n,A)?d=!0:Bs(n)?(d=!0,(n.tag!==null||n.anchor!==null)&&F(n,"alias node should not have any properties")):Es(n,A,Fe===e)&&(d=!0,n.tag===null&&(n.tag="?")),n.anchor!==null&&(n.anchorMap[n.anchor]=n.result,n.result.anchorId=n.anchor)):h===0&&(d=l&&ji(n,v))),n.tag!==null&&n.tag!=="!")if(n.tag=="!include")n.result||(n.result=J.newScalar(),n.result.startPosition=n.position,n.result.endPosition=n.position,F(n,"!include without value")),n.result.kind=J.Kind.INCLUDE_REF;else if(n.tag==="?")for(g=0,E=n.implicitTypes.length;g<E;g+=1){w=n.implicitTypes[g];var k=n.result.value;if(w.resolve(k)){n.result.valueObject=w.construct(n.result.value),n.tag=w.tag,n.anchor!==null&&(n.result.anchorId=n.anchor,n.anchorMap[n.anchor]=n.result);break}}else Pe.call(n.typeMap,n.tag)?(w=n.typeMap[n.tag],n.result!==null&&w.kind!==n.kind&&F(n,"unacceptable node kind for !<"+n.tag+'> tag; it should be "'+w.kind+'", not "'+n.kind+'"'),w.resolve(n.result)?(n.result=w.construct(n.result),n.anchor!==null&&(n.result.anchorId=n.anchor,n.anchorMap[n.anchor]=n.result)):F(n,"cannot resolve a node with !<"+n.tag+"> explicit tag")):ii(n,S,"unknown tag <"+n.tag+">",!1,!0);return n.tag!==null||n.anchor!==null||d}function Ts(n){var i=n.position,e,t,s,a=!1,u;for(n.version=null,n.checkLineBreaks=n.legacy,n.tagMap={},n.anchorMap={};(u=n.input.charCodeAt(n.position))!==0&&(P(n,!0,-1),u=n.input.charCodeAt(n.position),!(n.lineIndent>0||u!==37));){for(a=!0,u=n.input.charCodeAt(++n.position),e=n.position;u!==0&&!K(u);)u=n.input.charCodeAt(++n.position);for(t=n.input.slice(e,n.position),s=[],t.length<1&&F(n,"directive name must not be less than one character in length");u!==0;){for(;Ln(u);)u=n.input.charCodeAt(++n.position);if(u===35){do u=n.input.charCodeAt(++n.position);while(u!==0&&!sn(u));break}if(sn(u))break;for(e=n.position;u!==0&&!K(u);)u=n.input.charCodeAt(++n.position);s.push(n.input.slice(e,n.position))}u!==0&&bi(n),Pe.call(Hi,t)?Hi[t](n,t,s):(ri(n,'unknown document directive "'+t+'"'),n.position++)}if(P(n,!0,-1),n.lineIndent===0&&n.input.charCodeAt(n.position)===45&&n.input.charCodeAt(n.position+1)===45&&n.input.charCodeAt(n.position+2)===45?(n.position+=3,P(n,!0,-1)):a&&F(n,"directives end mark is expected"),Kn(n,n.lineIndent-1,Se,!1,!0),P(n,!0,-1),n.checkLineBreaks&&hs.test(n.input.slice(i,n.position))&&ri(n,"non-ASCII line breaks are interpreted as content"),n.documents.push(n.result),n.position===n.lineStart&&ye(n)){n.input.charCodeAt(n.position)===46&&(n.position+=3,P(n,!0,-1));return}if(n.position<n.length-1)F(n,"end of the stream or a document separator is expected");else return}function dr(n,i){n=String(n),i=i||{};var e=n.length;e!==0&&(n.charCodeAt(e-1)!==10&&n.charCodeAt(e-1)!==13&&(n+=`
`),n.charCodeAt(0)===65279&&(n=n.slice(1)));var t=new ws(n,i);for(t.input+="\0";t.input.charCodeAt(t.position)===32;)t.lineIndent+=1,t.position+=1;for(;t.position<t.length-1;){var s=t.position;if(Ts(t),t.position<=s)for(;t.position<t.length-1;t.position++){var a=t.input.charAt(t.position);if(a==`
`)break}}var u=t.documents,l=u.length;l>0&&(u[l-1].endPosition=e);for(var h=0,y=u;h<y.length;h++){var d=y[h];d.errors=t.errors,d.startPosition>d.endPosition&&(d.startPosition=d.endPosition)}return u}function Ai(n,i,e){e===void 0&&(e={});var t=dr(n,e),s,a;for(s=0,a=t.length;s<a;s+=1)i(t[s])}hn.loadAll=Ai;function vi(n,i){i===void 0&&(i={});var e=dr(n,i);if(e.length!==0){if(e.length===1)return e[0];var t=new xi("expected a single document in the stream, but found more");return t.mark=new gi("","",0,0,0),t.mark.position=e[0].endPosition,e[0].errors.push(t),e[0]}}hn.load=vi;function mr(n,i,e){e===void 0&&(e={}),Ai(n,i,xn.extend({schema:ar},e))}hn.safeLoadAll=mr;function yr(n,i){return i===void 0&&(i={}),vi(n,xn.extend({schema:ar},i))}hn.safeLoad=yr;hn.loadAll=Ai;hn.load=vi;hn.safeLoadAll=mr;hn.safeLoad=yr;var Ue={};Object.defineProperty(Ue,"__esModule",{value:!0});var xe=Z,Ci=me,$s=lr,ks=yi,Fi=Object.prototype.toString,xr=Object.prototype.hasOwnProperty,Ls=9,Cn=10,Os=13,qe=32,Ms=33,ti=34,Rs=35,Ns=37,Ps=38,oi=39,Us=42,Ds=44,Xs=45,zs=58,Ys=62,Hs=63,js=64,Ws=91,qs=93,Gs=96,Vs=123,Ks=124,Qs=125,Y={};Y[0]="\\0";Y[7]="\\a";Y[8]="\\b";Y[9]="\\t";Y[10]="\\n";Y[11]="\\v";Y[12]="\\f";Y[13]="\\r";Y[27]="\\e";Y[34]='\\"';Y[92]="\\\\";Y[133]="\\N";Y[160]="\\_";Y[8232]="\\L";Y[8233]="\\P";var Js=["y","Y","yes","Yes","YES","on","On","ON","n","N","no","No","NO","off","Off","OFF"];function Zs(n,i){var e,t,s,a,u,l,h;if(i===null)return{};for(e={},t=Object.keys(i),s=0,a=t.length;s<a;s+=1)u=t[s],l=String(i[u]),u.slice(0,2)==="!!"&&(u="tag:yaml.org,2002:"+u.slice(2)),h=n.compiledTypeMap[u],h&&xr.call(h.styleAliases,l)&&(l=h.styleAliases[l]),e[u]=l;return e}function nl(n){var i,e,t;if(i=n.toString(16).toUpperCase(),n<=255)e="x",t=2;else if(n<=65535)e="u",t=4;else if(n<=4294967295)e="U",t=8;else throw new Ci("code point within a string may not be greater than 0xFFFFFFFF");return"\\"+e+xe.repeat("0",t-i.length)+i}function el(n){this.schema=n.schema||$s,this.indent=Math.max(1,n.indent||2),this.skipInvalid=n.skipInvalid||!1,this.flowLevel=xe.isNothing(n.flowLevel)?-1:n.flowLevel,this.styleMap=Zs(this.schema,n.styles||null),this.implicitTypes=this.schema.compiledImplicit,this.explicitTypes=this.schema.compiledExplicit,this.tag=null,this.result="",this.duplicates=[],this.usedDuplicates=null}function Wi(n,i){for(var e=xe.repeat(" ",i),t=0,s=-1,a="",u,l=n.length;t<l;)s=n.indexOf(`
`,t),s===-1?(u=n.slice(t),t=l):(u=n.slice(t,s+1),t=s+1),u.length&&u!==`
`&&(a+=e),a+=u;return a}function si(n,i){return`
`+xe.repeat(" ",n.indent*i)}function il(n,i){var e,t,s;for(e=0,t=n.implicitTypes.length;e<t;e+=1)if(s=n.implicitTypes[e],s.resolve(i))return!0;return!1}function De(n){this.source=n,this.result="",this.checkpoint=0}De.prototype.takeUpTo=function(n){var i;if(n<this.checkpoint)throw i=new Error("position should be > checkpoint"),i.position=n,i.checkpoint=this.checkpoint,i;return this.result+=this.source.slice(this.checkpoint,n),this.checkpoint=n,this};De.prototype.escapeChar=function(){var n,i;return n=this.source.charCodeAt(this.checkpoint),i=Y[n]||nl(n),this.result+=i,this.checkpoint+=1,this};De.prototype.finish=function(){this.source.length>this.checkpoint&&this.takeUpTo(this.source.length)};function rl(n,i,e){var t,s,a,u,l,h,y,d,g,E,w,A,v,S,k,j,T,nn,D,dn,Jn;if(i.length===0){n.dump="''";return}if(i.indexOf("!include")==0){n.dump=""+i;return}if(i.indexOf("!$$$novalue")==0){n.dump="";return}if(Js.indexOf(i)!==-1){n.dump="'"+i+"'";return}for(t=!0,s=i.length?i.charCodeAt(0):0,a=qe===s||qe===i.charCodeAt(i.length-1),(Xs===s||Hs===s||js===s||Gs===s)&&(t=!1),a?(t=!1,u=!1,l=!1):(u=!0,l=!0),h=!0,y=new De(i),d=!1,g=0,E=0,w=n.indent*e,A=80,w<40?A-=w:A=40,S=0;S<i.length;S++){if(v=i.charCodeAt(S),t)if(!ol(v))t=!1;else continue;h&&v===oi&&(h=!1),k=Y[v],j=gr(v),!(!k&&!j)&&(v!==Cn&&v!==ti&&v!==oi?(u=!1,l=!1):v===Cn&&(d=!0,h=!1,S>0&&(T=i.charCodeAt(S-1),T===qe&&(l=!1,u=!1)),u&&(nn=S-g,g=S,nn>E&&(E=nn))),v!==ti&&(h=!1),y.takeUpTo(S),y.escapeChar())}if(t&&il(n,i)&&(t=!1),D="",(u||l)&&(dn=0,i.charCodeAt(i.length-1)===Cn&&(dn+=1,i.charCodeAt(i.length-2)===Cn&&(dn+=1)),dn===0?D="-":dn===2&&(D="+")),l&&E<A&&(u=!1),d||(l=!1),t)n.dump=i;else if(h)n.dump="'"+i+"'";else if(u)Jn=tl(i,A),n.dump=">"+D+`
`+Wi(Jn,w);else if(l)D||(i=i.replace(/\n$/,"")),n.dump="|"+D+`
`+Wi(i,w);else if(y)y.finish(),n.dump='"'+y.result+'"';else throw new Error("Failed to dump scalar value")}function tl(n,i){var e="",t=0,s=n.length,a=/\n+$/.exec(n),u;for(a&&(s=a.index+1);t<s;)u=n.indexOf(`
`,t),u>s||u===-1?(e&&(e+=`

`),e+=qi(n.slice(t,s),i),t=s):(e&&(e+=`

`),e+=qi(n.slice(t,u),i),t=u+1);return a&&a[0]!==`
`&&(e+=a[0]),e}function qi(n,i){if(n==="")return n;for(var e=/[^\s] [^\s]/g,t="",s=0,a=0,u=e.exec(n),l,h,y;u;)l=u.index,l-a>i&&(s!==a?h=s:h=l,t&&(t+=`
`),y=n.slice(a,h),t+=y,a=h+1),s=l+1,u=e.exec(n);return t&&(t+=`
`),a!==s&&n.length-a>i?t+=n.slice(a,s)+`
`+n.slice(s+1):t+=n.slice(a),t}function ol(n){return Ls!==n&&Cn!==n&&Os!==n&&Ds!==n&&Ws!==n&&qs!==n&&Vs!==n&&Qs!==n&&Rs!==n&&Ps!==n&&Us!==n&&Ms!==n&&Ks!==n&&Ys!==n&&oi!==n&&ti!==n&&Ns!==n&&zs!==n&&!Y[n]&&!gr(n)}function gr(n){return!(32<=n&&n<=126||n===133||160<=n&&n<=55295||57344<=n&&n<=65533||65536<=n&&n<=1114111)}function sl(n,i,e){var t="",s=n.tag,a,u;for(a=0,u=e.length;a<u;a+=1)On(n,i,e[a],!1,!1)&&(a!==0&&(t+=", "),t+=n.dump);n.tag=s,n.dump="["+t+"]"}function ll(n,i,e,t){var s="",a=n.tag,u,l;for(u=0,l=e.length;u<l;u+=1)On(n,i+1,e[u],!0,!0)&&((!t||u!==0)&&(s+=si(n,i)),s+="- "+n.dump);n.tag=a,n.dump=s||"[]"}function al(n,i,e){var t="",s=n.tag,a=Object.keys(e),u,l,h,y,d;for(u=0,l=a.length;u<l;u+=1)d="",u!==0&&(d+=", "),h=a[u],y=e[h],On(n,i,h,!1,!1)&&(n.dump.length>1024&&(d+="? "),d+=n.dump+": ",On(n,i,y,!1,!1)&&(d+=n.dump,t+=d));n.tag=s,n.dump="{"+t+"}"}function ul(n,i,e,t){var s="",a=n.tag,u=Object.keys(e),l,h,y,d,g,E;for(l=0,h=u.length;l<h;l+=1)E="",(!t||l!==0)&&(E+=si(n,i)),y=u[l],d=e[y],On(n,i+1,y,!0,!0)&&(g=n.tag!==null&&n.tag!=="?"||n.dump&&n.dump.length>1024,g&&(n.dump&&Cn===n.dump.charCodeAt(0)?E+="?":E+="? "),E+=n.dump,g&&(E+=si(n,i)),On(n,i+1,d,!0,g)&&(n.dump&&Cn===n.dump.charCodeAt(0)?E+=":":E+=": ",E+=n.dump,s+=E));n.tag=a,n.dump=s||"{}"}function Gi(n,i,e){var t,s,a,u,l,h;for(s=e?n.explicitTypes:n.implicitTypes,a=0,u=s.length;a<u;a+=1)if(l=s[a],(l.instanceOf||l.predicate)&&(!l.instanceOf||typeof i=="object"&&i instanceof l.instanceOf)&&(!l.predicate||l.predicate(i))){if(n.tag=e?l.tag:"?",l.represent){if(h=n.styleMap[l.tag]||l.defaultStyle,Fi.call(l.represent)==="[object Function]")t=l.represent(i,h);else if(xr.call(l.represent,h))t=l.represent[h](i,h);else throw new Ci("!<"+l.tag+'> tag resolver accepts not "'+h+'" style');n.dump=t}return!0}return!1}function On(n,i,e,t,s){n.tag=null,n.dump=e,Gi(n,e,!1)||Gi(n,e,!0);var a=Fi.call(n.dump);t&&(t=0>n.flowLevel||n.flowLevel>i),(n.tag!==null&&n.tag!=="?"||n.indent!==2&&i>0)&&(s=!1);var u=a==="[object Object]"||a==="[object Array]",l,h;if(u&&(l=n.duplicates.indexOf(e),h=l!==-1),h&&n.usedDuplicates[l])n.dump="*ref_"+l;else{if(u&&h&&!n.usedDuplicates[l]&&(n.usedDuplicates[l]=!0),a==="[object Object]")t&&Object.keys(n.dump).length!==0?(ul(n,i,n.dump,s),h&&(n.dump="&ref_"+l+(i===0?`
`:"")+n.dump)):(al(n,i,n.dump),h&&(n.dump="&ref_"+l+" "+n.dump));else if(a==="[object Array]")t&&n.dump.length!==0?(ll(n,i,n.dump,s),h&&(n.dump="&ref_"+l+(i===0?`
`:"")+n.dump)):(sl(n,i,n.dump),h&&(n.dump="&ref_"+l+" "+n.dump));else if(a==="[object String]")n.tag!=="?"&&rl(n,n.dump,i);else{if(n.skipInvalid)return!1;throw new Ci("unacceptable kind of an object to dump "+a)}n.tag!==null&&n.tag!=="?"&&(n.dump="!<"+n.tag+"> "+n.dump)}return!0}function cl(n,i){var e=[],t=[],s,a;for(li(n,e,t),s=0,a=t.length;s<a;s+=1)i.duplicates.push(e[t[s]]);i.usedDuplicates=new Array(a)}function li(n,i,e){Fi.call(n);var t,s,a;if(n!==null&&typeof n=="object")if(s=i.indexOf(n),s!==-1)e.indexOf(s)===-1&&e.push(s);else if(i.push(n),Array.isArray(n))for(s=0,a=n.length;s<a;s+=1)li(n[s],i,e);else for(t=Object.keys(n),s=0,a=t.length;s<a;s+=1)li(n[t[s]],i,e)}function wr(n,i){i=i||{};var e=new el(i);return cl(n,e),On(e,0,n,!0,!0)?e.dump+`
`:""}Ue.dump=wr;function fl(n,i){return wr(n,xe.extend({schema:ks},i))}Ue.safeDump=fl;var br={};(function(n){Object.defineProperty(n,"__esModule",{value:!0});function i(l){if(["true","True","TRUE"].lastIndexOf(l)>=0)return!0;if(["false","False","FALSE"].lastIndexOf(l)>=0)return!1;throw'Invalid boolean "'+l+'"'}n.parseYamlBoolean=i;function e(l){return l.lastIndexOf("0o",0)===0?parseInt(l.substring(2),8):parseInt(l)}function t(l){var h=e(l);if(isNaN(h))throw'Invalid integer "'+l+'"';return h}n.parseYamlInteger=t;function s(l){if([".nan",".NaN",".NAN"].lastIndexOf(l)>=0)return NaN;var h=/^([-+])?(?:\.inf|\.Inf|\.INF)$/,y=h.exec(l);if(y)return y[1]==="-"?-1/0:1/0;var d=parseFloat(l);if(!isNaN(d))return d;throw'Invalid float "'+l+'"'}n.parseYamlFloat=s;var a;(function(l){l[l.null=0]="null",l[l.bool=1]="bool",l[l.int=2]="int",l[l.float=3]="float",l[l.string=4]="string"})(a=n.ScalarType||(n.ScalarType={}));function u(l){if(l===void 0)return a.null;if(l.doubleQuoted||!l.plainScalar||l.singleQuoted)return a.string;var h=l.value;if(["null","Null","NULL","~",""].indexOf(h)>=0||h==null)return a.null;if(["true","True","TRUE","false","False","FALSE"].indexOf(h)>=0)return a.bool;var y=/^[-+]?[0-9]+$/,d=/^0o[0-7]+$/,g=/^0x[0-9a-fA-F]+$/;if(y.test(h)||d.test(h)||g.test(h))return a.int;var E=/^[-+]?(\.[0-9]+|[0-9]+(\.[0-9]*)?)([eE][-+]?[0-9]+)?$/,w=/^[-+]?(\.inf|\.Inf|\.INF)$/;return E.test(h)||w.test(h)||[".nan",".NaN",".NAN"].indexOf(h)>=0?a.float:a.string}n.determineScalarType=u})(br);(function(n){function i(s){for(var a in s)n.hasOwnProperty(a)||(n[a]=s[a])}Object.defineProperty(n,"__esModule",{value:!0});var e=hn;n.load=e.load,n.loadAll=e.loadAll,n.safeLoad=e.safeLoad,n.safeLoadAll=e.safeLoadAll;var t=Ue;n.dump=t.dump,n.safeDump=t.safeDump,n.YAMLException=me,i(de),i(br)})(Ke);const hl=(n,i)=>typeof n=="string"&&n.startsWith("$")?i[n.slice(1)]||0:n||0,ai=(n,i,e)=>{if(n!=null&&n.group)return Er(n.group,i,e);if(n!=null&&n.function){const t=n.args.map(u=>ai(u,i,e)),s=e[n.function];if(typeof s=="function")return s(...t)||0;const a=Math[n.function];return typeof a=="function"&&a.apply(null,t)||0}return hl(n==null?void 0:n.value,i)},Er=(n,i,e={})=>{var s;let t=ai(n[0],i,e)||0;for(let a=1;a<n.length;a+=2){const u=(s=n[a])==null?void 0:s.operator;let l=ai(n[a+1],i,e)||0;switch(u){case"+":t+=l;break;case"-":t-=l;break;case"*":t*=l;break;case"/":t/=l;break;case"%":t%=l;break;default:throw new Error(`Unknown operator: ${u}`)}}return t},pl=n=>{const i=t=>{var s,a,u;return typeof((s=t==null?void 0:t.value)==null?void 0:s.valueObject)<"u"?(a=t==null?void 0:t.value)==null?void 0:a.valueObject:(u=t==null?void 0:t.value)==null?void 0:u.value},e=(t,{key:{value:s},value:a})=>a!=null&&a.items?(t[s]=a.items.map(i),t):a!=null&&a.mappings?(t[s]=a.mappings.reduce(e,{}),t):a?(t[s]=typeof a.valueObject<"u"?a.valueObject:a.value,t):{};return n.reduce(e,{})||{}},dl={box:["width","height","depth","widthSegments","heightSegments","depthSegments"],capsule:["radius","length","capSubdivisions","radialSegments"],circle:["radius","segments","thetaStart","thetaLength"],cone:["radius","height","radialSegments","heightSegments","openEnded","thetaStart","thetaLength"],cylinder:["radiusTop","radiusBottom","height","radialSegments","heightSegments","openEnded","thetaStart","thetaLength"],dodecahedron:["radius","detail"],icosahedron:["radius","detail"],octahedron:["radius","detail"],parametric:["func","slices","stacks"],plane:["width","height","widthSegments","heightSegments"],polyhedron:["vertices","indices","radius","detail"],ring:["innerRadius","outerRadius","thetaSegments","phiSegments","thetaStart","thetaLength"],sphere:["radius","widthSegments","heightSegments","phiStart","phiLength","thetaStart","thetaLength"],tetrahedron:["radius","detail"],text:["text","parameters"],torus:["radius","tube","radialSegments","tubularSegments","arc"],torusKnot:["radius","tube","tubularSegments","radialSegments","p","q"],tube:["path","tubularSegments","radius","radiusSegments","closed"]},Ar={ambient:["color","intensity"],directional:["color","intensity"],hemisphere:["skyColor","groundColor","intensity"],point:["color","intensity","distance","decay"],areaRect:["color","intensity","width","height"],spot:["color","intensity","distance","angle","penumbra","decay"]},ml={perspective:["fov","aspect","near","far"],orthographic:["left","right","top","bottom","near","far"]},yl=n=>{let i=0,e=0,t=0;for(let s=0;s<n.length;s++)if(n[s]==="(")i||(t=s+1),i++;else if(n[s]===")"&&(e++,i-e===0))return[t,s];return!1},xl=n=>{const i=n.match(/([\/\-+%*]+\s*){0,1}([a-z]+)\s*$/i);return i?i[2]:!1},vr=(n,i=",")=>{let e=0,t=0,s=0;const a=[];for(let u=0;u<n.length;u++)n[u]===i?e-t===0&&(a.push(n.slice(s,u)),s=u+1):n[u]==="("?e++:n[u]===")"&&t++;return a.length?a.push(n.slice(s).trim()):a.push(n.trim()),a},Vi=n=>{const i=n.trim(),e=Number(i);return Number.isNaN(e)?i:e},Ki=n=>{if(!n)return[];const i=[];if(Array.from(n.trim().matchAll(/([\-]{0,1}[^\/\-+%*]*)([\/\-+%*]{1,1})\s*([\-]{0,1}[^\/\-+%*]*)/g)).forEach((e,t)=>{const[,s,a,u]=e,l=Vi(s),h=Vi(u),y=a;!t&&l?u?i.push(l,y,h):i.push(l,y):l&&y==="-"?i.push(l,`-${h}`):u?i.push(y,h):y&&i.push(y)}),i.length===0){const e=Number(n);return Number.isNaN(e)?[n]:[e]}return i},Qi=n=>{if(typeof n=="number")return{value:n};const i=n.trim()||"";if(["+","-","%","/","*"].includes(i))return{operator:i};const e=Number(i);return Number.isNaN(e)?{value:i}:{value:e}},be=(n,i=[],e={})=>{const t=yl(n);if(!t)return n&&i.push(...Ki(n).map(Qi)),i;const[s,a]=t,u=i.at(-1),l=(u==null?void 0:u.substr)||n.slice(0,s-1)||"",h=n.slice(s,a),y=xl(l);if(y){u&&i.pop();const d=l.slice(0,s-(y.length+1)).trim();d&&i.push({substr:d});const g=vr(h),E=[];g.forEach(w=>{const A=be(w,[],e);E.push(A.length===1?A[0]:{group:A})}),i.push({function:y,args:E})}else s>1&&i.push({substr:n.slice(0,s-1)}),i.push({group:be(h,[],e)});return a<n.length&&be(n.slice(a+1),i,e),i.reduce((d,g)=>(g.substr?d.push(...Ki(g.substr).map(Qi)):d.push(g),d),[])};var gl=function(i){return wl(i)&&!bl(i)};function wl(n){return!!n&&typeof n=="object"}function bl(n){var i=Object.prototype.toString.call(n);return i==="[object RegExp]"||i==="[object Date]"||vl(n)}var El=typeof Symbol=="function"&&Symbol.for,Al=El?Symbol.for("react.element"):60103;function vl(n){return n.$$typeof===Al}function Cl(n){return Array.isArray(n)?[]:{}}function te(n,i){return i.clone!==!1&&i.isMergeableObject(n)?Qn(Cl(n),n,i):n}function Fl(n,i,e){return n.concat(i).map(function(t){return te(t,e)})}function Sl(n,i){if(!i.customMerge)return Qn;var e=i.customMerge(n);return typeof e=="function"?e:Qn}function Il(n){return Object.getOwnPropertySymbols?Object.getOwnPropertySymbols(n).filter(function(i){return n.propertyIsEnumerable(i)}):[]}function Ji(n){return Object.keys(n).concat(Il(n))}function Cr(n,i){try{return i in n}catch{return!1}}function _l(n,i){return Cr(n,i)&&!(Object.hasOwnProperty.call(n,i)&&Object.propertyIsEnumerable.call(n,i))}function Bl(n,i,e){var t={};return e.isMergeableObject(n)&&Ji(n).forEach(function(s){t[s]=te(n[s],e)}),Ji(i).forEach(function(s){_l(n,s)||(Cr(n,s)&&e.isMergeableObject(i[s])?t[s]=Sl(s,e)(n[s],i[s],e):t[s]=te(i[s],e))}),t}function Qn(n,i,e){e=e||{},e.arrayMerge=e.arrayMerge||Fl,e.isMergeableObject=e.isMergeableObject||gl,e.cloneUnlessOtherwiseSpecified=te;var t=Array.isArray(i),s=Array.isArray(n),a=t===s;return a?t?e.arrayMerge(n,i,e):Bl(n,i,e):te(i,e)}Qn.all=function(i,e){if(!Array.isArray(i))throw new Error("first argument should be an array");return i.reduce(function(t,s){return Qn(t,s,e)},{})};var Tl=Qn,$l=Tl;function Fr(n,i,e){const t={};for(const s in n)n.hasOwnProperty(s)&&(typeof n[s]=="object"?t[s]=Fr(n[s],i,e):typeof n[s]=="string"&&(t[s]=n[s].split(i).join(e)));return t}function kl([n,i="1"]){return{name:n,count:Number(i)}}function Ll(n){const i=n.slice(1),[e,...t]=i.split(/ |\(/i).map(u=>u.trim()).filter(Boolean),s=t.join(" ").trim(),a=vr(s.endsWith(")")?s.slice(0,-1):s).filter(Boolean);return[e,a.length?kl(a):{}]}function Ol(n,i){const{count:e,name:t,...s}=n,{[t]:a}=i,u={};for(let l=1;l<=e;l+=1)u[`${t}-${l}`]=$l(a,Fr(s,"_index",l));return u}const Ml={copy:Ol};function Rl(n,i,e){const t=Ml[n];if(!t)throw new Error(`Unknown operation: ${n}`);return t(i,e)}var gn;class Nl extends EventTarget{constructor(){super(...arguments);C(this,gn,{})}addPlugins(...e){return e.forEach(t=>{if(m(this,gn)[t.name])return;const a=new t(this);m(this,gn)[t.name]=a}),this}removePlugin(e){const t=m(this,gn)[e];return t?(typeof t.dispose=="function"&&t.dispose(),delete m(this,gn)[e],this):this}get plugins(){return m(this,gn)}}gn=new WeakMap;const Pl=`<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-x" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  <line x1="18" y1="6" x2="6" y2="18" />
  <line x1="6" y1="6" x2="18" y2="18" />
</svg>`,Ul=`.fs-ctrls {
  --color: currentColor;
  --background-color: rgba(255, 255, 255, 0.75);
  --border-radius: 3px;
  --border-color: rgba(0, 0, 0, 0.25);
  --spacing: 5px;

  border: 1px solid var(--color);
  border-radius: var(--border-radius);
  background-color: var(--background-color);
  backdrop-filter: blur(4px);

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;

  position: absolute;
  inset: 25%;
  z-index: 999;
}

.fs-ctrls > * {
  padding: var(--spacing);
}

.fs-ctrls button,
.fs-ctrls select,
.fs-ctrls input,
.fs-ctrls textarea {
  margin: 0;
  padding: 0;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background-color: var(--background-color);
  cursor: pointer;
}

.fs-ctrls label {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  align-items: stretch;
}

.fs-ctrls svg {
  width: 24px;
  height: 24px;
  display: block;
}

.fs-ctrls-close {
  position: absolute;
  top: 0;
  right: 0;
  border-radius: 0 0 0 var(--border-radius);
  border-width: 0 0 1px 1px;
}

.fs-ctrls-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.fs-ctrls-main {
}

.fs-ctrls-content {
  position: relative;
}
`,Dl=`
<header class="fs-ctrls-header">
  <h1>Foreseen</h1>

  <button
    class="fs-ctrls-close close"
    type="button"
    title="Close controls"
  >
    ${Pl}
  </button>
</header>

<main class="fs-ctrls-main">
  <div class="fs-ctrls-content content"></div>
</main>
`;var wn,zn,Ee;class Xl{constructor(i){C(this,zn);C(this,wn,void 0);var s;const e=document.createElement("dialog");e.classList.add("fs-ctrls"),e.innerHTML=Dl,i.domElement.style.position="relative",_(this,wn,e);const t=document.createElement("style");t.textContent=Ul,t.id="controls-styles",i.domElement.appendChild(t),(s=B(this,zn,Ee).call(this,"button.close"))==null||s.addEventListener("click",()=>{this.open=!1}),i.domElement.addEventListener("dblclick",()=>{this.open=!this.open}),i.domElement.appendChild(e),this.open=!1}get open(){return m(this,wn).open}set open(i){m(this,wn).open=i,m(this,wn).style.display=i?"flex":"none"}append(i){var e;(e=B(this,zn,Ee).call(this,".content"))==null||e.appendChild(i)}remove(i){var e;(e=B(this,zn,Ee).call(this,".content"))==null||e.removeChild(i)}appendElement(i,e){const t=document.createElement(i);return t.classList.add(e),this.append(t),t}}wn=new WeakMap,zn=new WeakSet,Ee=function(i){return m(this,wn).querySelector(i)};const ne=n=>Object.keys(n||{}).length===0,ie=n=>(n||"").charAt(0).toUpperCase()+n.slice(1),Ae=(n,i)=>i.map(e=>n[e]),zl={cameras:"perspective",lights:"spot",meshes:"box"},Yl={cameras:"camera",lights:"light",meshes:"geometry"},Hl=(n,i=zl[n])=>`${ie(i)}${ie(Yl[n])}`,jl=(n,i,e)=>{const{type:t,...s}=i;if(Object.entries((s==null?void 0:s.children)||{}).length)return new e.Group;const u=Hl(n,t),l=e[u];if(!l)return console.warn(`Class ${u} not found in THREE`),null;let h=null;if(n==="cameras"){const y=Ae(s,ml[t]);h=new l(...y)}if(n==="lights"){const y=Ae(s,Ar[t]);h=new l(...y)}if(n==="meshes"){const y=Ae(s,dl[t]),d=new l(...y);h=new e.Mesh(d,s.material)}return h},Ge={fps:0,frames:0,stamp:0,lastFrameRenderTime:0};class yn extends CustomEvent{}const Wl={startrenderloop:yn,stoprenderloop:yn,startanimation:yn,pauseanimation:yn,resumeanimation:yn,stopanimation:yn,prerender:yn,render:yn},ql=n=>{var i;return((i=n.geometry)==null?void 0:i.parameters)||{}},Gl=(n,i)=>{const e=ql(n),t=Object.keys(e);for(let s=0;s<t.length;s+=1){const a=t[s];if(typeof i[a]<"u"&&i[a]!==e[a])return!0}return!1};var oe,bn,rn,Fn,Yn,Hn,U,V,se,jn,En,W,Wn,un,Q,on,pn,Ie,Ir,qn,ve,le,ui,Sn,ee,_e,_r,Be,Br,Te,Tr,$e,$r,ke,kr,ae,ci,ue,fi,Le,Lr;class Sr extends Nl{constructor(e,t){super();C(this,on);C(this,Ie);C(this,qn);C(this,le);C(this,Sn);C(this,_e);C(this,Be);C(this,Te);C(this,$e);C(this,ke);C(this,ae);C(this,ue);C(this,Le);C(this,oe,void 0);C(this,bn,void 0);C(this,rn,void 0);C(this,Fn,"");C(this,Yn,void 0);C(this,Hn,void 0);C(this,U,void 0);C(this,V,void 0);C(this,se,{});C(this,jn,{now:0,startTime:0,isRendering:!1,stats:{...Ge}});C(this,En,void 0);C(this,W,void 0);C(this,Wn,0);H(this,"renderers",{});H(this,"cameras",{});H(this,"lights",{});H(this,"materials",{});H(this,"meshes",{});C(this,un,void 0);C(this,Q,{...Ge});H(this,"onstartrenderloop",()=>{});H(this,"onstoprenderloop",()=>{});H(this,"onstartanimation",()=>{});H(this,"onpauseanimation",()=>{});H(this,"onresumeanimation",()=>{});H(this,"onstopanimation",()=>{});H(this,"onprerender",()=>{});H(this,"onrender",()=>{});_(this,V,e),_(this,En,new e.Scene),_(this,W,new e.Clock(!1)),_(this,rn,document.createElement("canvas"));const s=document.createElement("div");s.className="foreseen",s.appendChild(m(this,rn)),_(this,bn,s),_(this,oe,new Xl(this)),_(this,Fn,t),_(this,Hn,Ke.load(t)),B(this,qn,ve).call(this)}addPlugins(...e){return super.addPlugins(...e),Object.entries(this.plugins).forEach(([t,s])=>{var u;if(typeof(s==null?void 0:s.registerFunctions)=="function"){const l=s.registerFunctions();Object.assign(m(this,se),(typeof l=="function"?l():l)||{})}const a=s==null?void 0:s.controlsElement;a&&((u=m(this,bn).querySelector("dialog .controls-content"))==null||u.appendChild(a))}),this}removePlugin(e){var a;const t=this.plugins[e];if(!t)return this;super.removePlugin(e);const s=t.controlsElement;return s&&((a=m(this,bn).querySelector("dialog .controls-content"))==null||a.removeChild(s)),this}addEventListener(e,t,s){return super.addEventListener(e,t,s)}get canvas(){return m(this,rn)}get scene(){return m(this,En)}get defaultRenderer(){return this.renderers[Object.keys(this.renderers)[0]]}get domElement(){return m(this,bn)}get controls(){return m(this,oe)}get defaultCamera(){return this.cameras[Object.keys(this.cameras)[0]]}get defaultMaterial(){return this.materials[Object.keys(this.materials)[0]]}get isRendering(){return m(this,un)!==void 0}get isRunning(){return m(this,W).running}get elapsedTime(){return m(this,W).elapsedTime}get startTime(){return m(this,W).startTime}get data(){return Object.freeze({...m(this,jn),stats:m(this,Q),now:this.elapsedTime,startTime:this.startTime,animationDuration:m(this,Wn),animationProgress:m(this,Wn)&&this.elapsedTime?this.elapsedTime/m(this,Wn):0,isRendering:this.isRendering})}get yamlObject(){return m(this,Yn)}get input(){return m(this,Fn)}setSizeFromContainer(e=m(this,bn).parentNode){const t=m(this,rn);return e&&(t.style.display="none",t.width=e.clientWidth,t.height=e.clientHeight,t.style.display="block",this.defaultRenderer.setSize(t.width,t.height),this.defaultCamera.type==="PerspectiveCamera"&&(this.defaultCamera.aspect=t.width/t.height,this.defaultCamera.updateProjectionMatrix())),this.render()}setSize(e,t){const s=m(this,rn);return s.width=e,s.height=t,this.defaultRenderer.setSize(e,t),this.defaultCamera.type==="PerspectiveCamera"&&(this.defaultCamera.aspect=e/t,this.defaultCamera.updateProjectionMatrix()),this.render()}addIfNotInScene(e,t=m(this,En)){if(!e.name){console.warn("Object has no name and will not be added to the scene",e);return}t.getObjectByName(e.name)||t.add(e)}removeFromScene(e){e==null||e.removeFromParent(),e instanceof m(this,V).Mesh&&e.geometry.dispose()}update(e){return m(this,Fn)===e?this:(_(this,Fn,e),_(this,Hn,Ke.load(e)),B(this,qn,ve).call(this))}toObject(){return m(this,U)}toJSON(){return m(this,U)}computeExpression(e,t=null){try{const s=be(e);return Er(s,t||this.data,m(this,se))}catch(s){return console.warn('Could not compute expression "%s"',e,s==null?void 0:s.stack),0}}render(e=0){_(this,un,void 0),B(this,on,pn).call(this,"prerender");const t=performance.now();m(this,W).getElapsedTime(),B(this,qn,ve).call(this);const s=m(this,En);m(this,W).getDelta();const u=m(this,rn).getContext("2d");u==null||u.clearRect(0,0,m(this,rn).width,m(this,rn).height),Object.keys(this.renderers).forEach(y=>{var T;const d=this.renderers[y],{width:g,height:E}=m(this,rn),{width:w,height:A}=d.domElement;if(!g||!E||!w||!A)return;const v=((T=m(this,U).renderers[y])==null?void 0:T.camera)||y,S=this.cameras[v]||this.defaultCamera;s&&S&&(d==null||d.render(s,S));const k=0,j=0;u==null||u.drawImage(d.domElement,0,0,w,A,k*.01*g,j*.01*E,w,A)});const l=performance.now();m(this,Q).lastFrameRenderTime=l-t,m(this,Q).frames+=1;const h=500;return l-m(this,Q).stamp>=h&&(m(this,Q).fps=m(this,Q).frames/(l-m(this,Q).stamp)*1e3,m(this,Q).stamp=l,m(this,Q).frames=0),B(this,on,pn).call(this,"render"),this}startRenderLoop(e=!0){if(m(this,un))return this;B(this,on,pn).call(this,"startrenderloop"),_(this,Q,{...Ge});const t=s=>{this.render(s),_(this,un,requestAnimationFrame(t))};return e&&(m(this,W).stop(),m(this,W).start()),t(0),this}stopRenderLoop(){return B(this,on,pn).call(this,"stoprenderloop"),m(this,un)&&cancelAnimationFrame(m(this,un)),_(this,un,void 0),this}startAnimation(){return B(this,on,pn).call(this,"startanimation"),m(this,W).start(),this}pauseAnimation(){return B(this,on,pn).call(this,"pauseanimation"),m(this,W).running=!1,this}resumeAnimation(){return B(this,on,pn).call(this,"resumeanimation"),m(this,W).running=!0,this}stopAnimation(){return B(this,on,pn).call(this,"stopanimation"),m(this,W).stop(),this}}oe=new WeakMap,bn=new WeakMap,rn=new WeakMap,Fn=new WeakMap,Yn=new WeakMap,Hn=new WeakMap,U=new WeakMap,V=new WeakMap,se=new WeakMap,jn=new WeakMap,En=new WeakMap,W=new WeakMap,Wn=new WeakMap,un=new WeakMap,Q=new WeakMap,on=new WeakSet,pn=function(e,t){const s=this[`on${e}`];return typeof s=="function"&&s(),this.dispatchEvent(new Wl[e](e,{detail:t})),this},Ie=new WeakSet,Ir=function(){var y;_(this,Yn,pl(((y=m(this,Hn))==null?void 0:y.mappings)||[])||{});const e=m(this,Yn),t=(e==null?void 0:e.variables)||{},s=this.data,a=Object.keys(t).reduce((d,g)=>{let E=t[g];return typeof E=="string"&&(E=this.computeExpression(E,{...s,...d})),d[g]=E,d},{});_(this,jn,{...m(this,jn),...a});const u={...e,renderers:ne(e==null?void 0:e.renderers)?{defaultRenderer:{}}:e.renderers,cameras:ne(e==null?void 0:e.cameras)?{defaultCamera:{type:"perspective",position:{x:15,y:15,z:15},lookAt:{x:0,y:0,z:0}}}:e.cameras,lights:ne(e==null?void 0:e.lights)?{defaultLight:{type:"spot",position:{x:15,y:15,z:15},lookAt:{x:0,y:0,z:0}}}:e.lights,materials:ne(e==null?void 0:e.materials)?{defaultMaterial:{}}:e.materials,meshes:ne(e==null?void 0:e.meshes)?{defaultMesh:{}}:e.meshes};["cameras","lights","materials","meshes","renderers"].forEach(d=>{Object.keys((u==null?void 0:u[d])||{}).forEach(g=>{if(!g.startsWith("+"))return;const E=u[d][g];delete u[d][g];const[w,A]=Ll(g),v={...A,...E};u[d]={...u[d],...Rl(w,v,u[d])}})});const l=d=>{const g=Pn(u,d);["position","rotation","scale"].forEach(E=>{typeof(g==null?void 0:g[E])>"u"||["x","y","z"].forEach(w=>{var v,S;if(typeof((v=g==null?void 0:g[E])==null?void 0:v[w])>"u")return;let A=((S=g[E])==null?void 0:S[w])||(E==="scale"?1:0);typeof A=="string"&&(A=this.computeExpression(A)),E==="rotation"&&(A*=Math.PI/180),Pi(u,`${d}.${E}.${w}`,A)})})};["cameras","lights","meshes"].forEach(d=>{Object.keys((u==null?void 0:u[d])||{}).forEach(g=>{l(`${d}.${g}`)})});const h=d=>{const g=Pn(u,d,{});Object.keys(g).forEach(E=>{if(["position","rotation","scale"].includes(E))return;if(E==="children"){Object.keys(g[E]).forEach(A=>{l(`${d}.children.${A}`),h(`${d}.children.${A}`)});return}let w=g[E]||0;typeof w=="string"&&(w=this.computeExpression(w)),Pi(u,`${d}.${E}`,w)})};return Object.keys(u.meshes||{}).forEach(d=>{h(`meshes.${d}`)}),u},qn=new WeakSet,ve=function(){var t,s,a,u,l,h;const e=m(this,U);return _(this,U,B(this,Ie,Ir).call(this)),B(h=B(l=B(u=B(a=B(s=B(t=B(this,_e,_r).call(this,e),Be,Br).call(t,e==null?void 0:e.renderers),Te,Tr).call(s,e==null?void 0:e.cameras),ke,kr).call(a,e==null?void 0:e.materials),$e,$r).call(u,e==null?void 0:e.lights),ae,ci).call(l,e==null?void 0:e.meshes),Le,Lr).call(h)},le=new WeakSet,ui=function(e,t){["position","rotation","scale"].forEach(s=>{const a=s==="scale"?1:0,u=[a,a,a];["x","y","z"].forEach((l,h)=>{const y=Pn(m(this,U),`${t}.${s}.${l}`);u[h]=typeof y=="number"?y:a}),(e==null?void 0:e[s]).set(...u)})},Sn=new WeakSet,ee=function(e,t,s=["position","rotation","scale","color","type","children"]){if(!e)return;const a=Pn(m(this,U),t);!a||Object.entries(a).forEach(([u,l])=>{if(s.includes(u))return;const h=e instanceof m(this,V).Mesh;let y=typeof(h?e.geometry.parameters[u]:e[u]);if(!(y==="undefined"||y==="function")&&!(typeof l=="function"||typeof l>"u"||l.constructor==="Object"))try{if(h){y==="boolean"?e.geometry.parameters[u]=!!l:e.geometry.parameters[u]=l;return}y==="boolean"?e[u]=!!l:e[u]=l}catch(d){console.warn(`Could not set ${u} to ${(e==null?void 0:e.name)||(e==null?void 0:e.type)}`,d)}})},_e=new WeakSet,_r=function(e){return["renderers","cameras","lights","materials","meshes"].forEach(t=>{const s=this[t],a=m(this,U)[t];Object.keys(s).forEach(u=>{var l,h;if(!((a==null?void 0:a[u])&&((l=e==null?void 0:e[u])==null?void 0:l.type)===((h=a[u])==null?void 0:h.type))){if(["cameras","lights","meshes"].includes(t)){const y=s[u];this.removeFromScene(y)}delete s[u]}})}),this},Be=new WeakSet,Br=function(e={}){const t=m(this,U);return Object.keys(t.renderers||{}).forEach(s=>{if(this.renderers[s])return;const a=new(m(this,V)).WebGLRenderer({antialias:!0,alpha:!0});a!=null&&a.shadowMap&&(a.shadowMap.enabled=!0),this.renderers[s]=a}),this},Te=new WeakSet,Tr=function(e={}){const t=m(this,U);return Object.keys(t.cameras||{}).forEach(s=>{var g,E,w,A,v,S,k;const a=t.cameras[s],{type:u="perspective"}=a,l=`${ie(u)}Camera`,h=m(this,V)[l];if(!h){this.cameras[s]&&this.addIfNotInScene(this.cameras[s]);return}const y=(g=this.defaultRenderer)==null?void 0:g.domElement;if(!y)return;const d=this.cameras[s]||new h(75,y.width/y.height,.1,1e3);d.name=`camera.${s}`,d.position.set(((E=a.position)==null?void 0:E.x)||15,((w=a.position)==null?void 0:w.y)||15,((A=a.position)==null?void 0:A.z)||15),d==null||d.lookAt(((v=a.lookAt)==null?void 0:v.x)||0,((S=a.lookAt)==null?void 0:S.y)||0,((k=a.lookAt)==null?void 0:k.z)||0),this.cameras[s]=d,this.addIfNotInScene(d)}),this},$e=new WeakSet,$r=function(e={}){const t=m(this,U);return Object.keys(t.lights||{}).forEach(s=>{var g,E,w,A,v,S;const a=t.lights[s],{type:u="spot"}=a,l=`${ie(u)}Light`,h=m(this,V)[l];if(!h){this.lights[s]&&this.addIfNotInScene(this.lights[s]);return}const y=Ae(a,Ar[u]),d=this.lights[s]||new h(...y);d.name=`lights.${s}`,d.position.set(((g=a.position)==null?void 0:g.x)||15,((E=a.position)==null?void 0:E.y)||15,((w=a.position)==null?void 0:w.z)||15),d==null||d.lookAt(((A=a.lookAt)==null?void 0:A.x)||0,((v=a.lookAt)==null?void 0:v.y)||0,((S=a.lookAt)==null?void 0:S.z)||0),this.lights[s]=d,this.addIfNotInScene(d)}),this},ke=new WeakSet,kr=function(e={}){const t=m(this,U);return Object.keys(t.materials||{}).forEach(s=>{const a=t.materials[s],{type:u="meshStandard",...l}=a,h=`${ie(u)}Material`,y=m(this,V)[h];if(!y)return;const d=this.materials[s]||new y(l);this.materials[s]=d}),this},ae=new WeakSet,ci=function(e={},t="",s=m(this,En)){const a=t?Pn(m(this,U).meshes,t):m(this,U).meshes;return Object.entries(a||{}).forEach(([u,l])=>{var v;const{type:h=Object.keys((l==null?void 0:l.children)||{}).length?"group":"box",material:y=u}=l||{};let d;typeof y=="string"?d=this.materials[y]?this.materials[y]:this.defaultMaterial:d=this.defaultMaterial;let g=this.meshes[u];g&&(((v=g.material)==null?void 0:v.uuid)!==d.uuid&&(g.material=d),Gl(g,l)&&(this.removeFromScene(g),g=null));const E=g||jl("meshes",{...l,type:h,material:d},m(this,V));if(!E){console.warn(`Could not create instance for ${u}`);return}const w=[t,u].map(S=>S.trim()).filter(Boolean).join("."),A=w.split(".children.").join(".");E.name=`meshes.${A}`,this.meshes[A]=E,this.addIfNotInScene(E,s),E instanceof m(this,V).Group&&B(this,ae,ci).call(this,e,`${w}.children`,E)}),this},ue=new WeakSet,fi=function(e){const t=Pn(m(this,U),e,{}),s=(t==null?void 0:t.children)||{};Object.keys(s).forEach(a=>{const u=[...e.replace(/^meshes\./,"").split(".children."),a].join("."),l=this.meshes[u];!l||(B(this,le,ui).call(this,l,`${e}.children.${a}`),l instanceof m(this,V).Group?B(this,ue,fi).call(this,`${e}.children.${a}`):B(this,Sn,ee).call(this,l,`${e}.children.${a}`))})},Le=new WeakSet,Lr=function(){const e=m(this,U);return["materials","cameras","lights","meshes"].forEach(t=>{Object.keys((e==null?void 0:e[t])||{}).forEach(s=>{var a,u,l,h,y,d,g,E,w,A;if(t==="materials"){const v=(a=this[t])==null?void 0:a[s];B(this,Sn,ee).call(this,v,`${t}.${s}`)}if(t==="materials"||t==="lights"){const v=(u=this[t])==null?void 0:u[s];v!=null&&v.color&&(v==null||v.color.set(e[t][s].color))}if(t==="cameras"||t==="lights"){const v=(l=this[t])==null?void 0:l[s];if(v){B(this,Sn,ee).call(this,v,e[t][s]);const{x:S=15,y:k=15,z:j=15}=((y=(h=e==null?void 0:e[t])==null?void 0:h[s])==null?void 0:y.position)||{};if((d=v==null?void 0:v.position)==null||d.set(S,k,j),typeof(v==null?void 0:v.lookAt)=="function"&&e[t][s]){const{lookAt:{x:T=0,y:nn=0,z:D=0}={}}=e[t][s];v==null||v.lookAt(T,nn,D)}}}if(t==="meshes"){const v=(g=this[t])==null?void 0:g[s];if(!v){console.warn("missing instance",s);return}B(this,le,ui).call(this,v,`${t}.${s}`),v instanceof m(this,V).Group?B(this,ue,fi).call(this,`${t}.${s}`):B(this,Sn,ee).call(this,v,`${t}.${s}`)}if(t==="lights"||t==="meshes"){const v=(E=this[t])==null?void 0:E[s];v.castShadow=((w=e[t][s])==null?void 0:w.castShadow)||!1,v.receiveShadow=((A=e[t][s])==null?void 0:A.receiveShadow)||!1}})}),this};var ce;class Si{constructor(i){C(this,ce,void 0);_(this,ce,i)}get parent(){return m(this,ce)}get name(){return this.constructor.name}get ready(){return!1}get controlsElement(){return null}connect(){}dispose(){}registerFunctions(){return{}}}ce=new WeakMap;const Or={minDecibels:-180,maxDecibels:120,smoothingTimeConstant:.85,fftSize:1024},Vl=n=>{const i=document.createElement("div");return i.classList.add("foreseen-plugin"),i.classList.add(`foreseen-plugin-${n.name}`),i.innerHTML=`
  <label>
    <span>Min. decibel</span>
    <input name="minDecibel" value="${n.audioConfig.minDecibels}" min="-240" max="0" type="number" />
  </label>
  <label>
    <span>Max. decibel</span>
    <input name="maxDecibel" value="${n.audioConfig.maxDecibels}" min="0" max="240" type="number" />
  </label>
  <label>
    <span>Smoothing time contstant</span>
    <input name="smoothingTimeContstant" value="${n.audioConfig.smoothingTimeConstant}" step="0.01" min="0" max="1" type="number" />
  </label>
  <label>
    <span>FFT Size</span>
    <input name="fftSize" value="${n.audioConfig.fftSize}" step="256" min="256" max="4096" type="number" />
  </label>
  `,i.querySelectorAll("input").forEach(e=>e.addEventListener("change",()=>{n.audioConfig={...Or,[e.name]:e.value}})),i};var In,Oe,_n,cn,N,Bn,Tn,fe,An,Me,Mr;class Kl extends Si{constructor(e){super(e);C(this,Me);C(this,In,void 0);C(this,Oe,null);C(this,_n,null);C(this,cn,null);C(this,N,null);C(this,Bn,null);C(this,Tn,null);C(this,fe,Or);C(this,An,null);_(this,In,Vl(this)),e.controls.append(m(this,In))}get ready(){return!!m(this,Oe)&&!!m(this,An)}get controlsElement(){return m(this,In)}set audioConfig(e){!m(this,cn)||!m(this,An)||(_(this,fe,e),_(this,N,m(this,cn).createAnalyser()),m(this,N).minDecibels=e.minDecibels,m(this,N).maxDecibels=e.maxDecibels,m(this,N).smoothingTimeConstant=e.smoothingTimeConstant,m(this,N).fftSize=e.fftSize,_(this,_n,m(this,cn).createMediaStreamSource(m(this,An))),m(this,_n).connect(m(this,N)))}get audioConfig(){return m(this,fe)}registerFunctions(){return{frequency:(e=0)=>!this.ready||!m(this,N)||!m(this,Bn)?1:(m(this,N).getByteFrequencyData(m(this,Bn)),m(this,Bn)[e]),timeDomain:(e=0)=>!this.ready||!m(this,N)||!m(this,Tn)?1:(m(this,N).getByteTimeDomainData(m(this,Tn)),m(this,Tn)[e])}}connect(){window.addEventListener("mousemove",()=>{console.info("[usermedia plugin] mousemove"),B(this,Me,Mr).call(this)},{once:!0})}dispose(){var e,t;console.info("[usermedia plugin] dispose"),(e=m(this,N))==null||e.disconnect(),(t=m(this,cn))==null||t.close(),this.parent.controls.remove(m(this,In))}}In=new WeakMap,Oe=new WeakMap,_n=new WeakMap,cn=new WeakMap,N=new WeakMap,Bn=new WeakMap,Tn=new WeakMap,fe=new WeakMap,An=new WeakMap,Me=new WeakSet,Mr=async function(){try{_(this,An,await navigator.mediaDevices.getUserMedia({audio:!0})),_(this,cn,new AudioContext),_(this,N,m(this,cn).createAnalyser()),m(this,N).minDecibels=this.audioConfig.minDecibels,m(this,N).maxDecibels=this.audioConfig.maxDecibels,m(this,N).smoothingTimeConstant=this.audioConfig.smoothingTimeConstant,m(this,N).fftSize=this.audioConfig.fftSize,_(this,Bn,new Uint8Array(m(this,N).frequencyBinCount)),_(this,Tn,new Uint8Array(m(this,N).frequencyBinCount)),_(this,_n,m(this,cn).createMediaStreamSource(m(this,An))),m(this,_n).connect(m(this,N))}catch(e){console.warn("[usermedia plugin] getMedia error",e)}};var he,pe;class Ql extends Si{constructor(e){super(e);C(this,he,0);C(this,pe,0);H(this,"eventListener",e=>{const{clientWidth:t,clientHeight:s}=e.target;!t||!s||(_(this,pe,1/s*e.y),_(this,he,1/t*e.x))});this.eventListener=this.eventListener.bind(this),this.parent.canvas.addEventListener("mousemove",this.eventListener)}get ready(){return!0}registerFunctions(){return{mouseX:()=>m(this,he),mouseY:()=>m(this,pe)}}dispose(){this.parent.canvas.removeEventListener("mousemove",this.eventListener)}}he=new WeakMap,pe=new WeakMap;var Rr={exports:{}};(function(n,i){(function(e,t){n.exports=t()})(st,function(){var e=function(){function t(w){return u.appendChild(w.dom),w}function s(w){for(var A=0;A<u.children.length;A++)u.children[A].style.display=A===w?"block":"none";a=w}var a=0,u=document.createElement("div");u.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000",u.addEventListener("click",function(w){w.preventDefault(),s(++a%u.children.length)},!1);var l=(performance||Date).now(),h=l,y=0,d=t(new e.Panel("FPS","#0ff","#002")),g=t(new e.Panel("MS","#0f0","#020"));if(self.performance&&self.performance.memory)var E=t(new e.Panel("MB","#f08","#201"));return s(0),{REVISION:16,dom:u,addPanel:t,showPanel:s,begin:function(){l=(performance||Date).now()},end:function(){y++;var w=(performance||Date).now();if(g.update(w-l,200),w>h+1e3&&(d.update(1e3*y/(w-h),100),h=w,y=0,E)){var A=performance.memory;E.update(A.usedJSHeapSize/1048576,A.jsHeapSizeLimit/1048576)}return w},update:function(){l=this.end()},domElement:u,setMode:s}};return e.Panel=function(t,s,a){var u=1/0,l=0,h=Math.round,y=h(window.devicePixelRatio||1),d=80*y,g=48*y,E=3*y,w=2*y,A=3*y,v=15*y,S=74*y,k=30*y,j=document.createElement("canvas");j.width=d,j.height=g,j.style.cssText="width:80px;height:48px";var T=j.getContext("2d");return T.font="bold "+9*y+"px Helvetica,Arial,sans-serif",T.textBaseline="top",T.fillStyle=a,T.fillRect(0,0,d,g),T.fillStyle=s,T.fillText(t,E,w),T.fillRect(A,v,S,k),T.fillStyle=a,T.globalAlpha=.9,T.fillRect(A,v,S,k),{dom:j,update:function(nn,D){u=Math.min(u,nn),l=Math.max(l,nn),T.fillStyle=a,T.globalAlpha=1,T.fillRect(0,0,d,v),T.fillStyle=s,T.fillText(h(nn)+" "+t+" ("+h(u)+"-"+h(l)+")",E,w),T.drawImage(j,A+y,v,S-y,k,A,v,S-y,k),T.fillRect(A+S-y,v,y,k),T.fillStyle=a,T.globalAlpha=.9,T.fillRect(A+S-y,v,y,h((1-nn/D)*k))}}},e})})(Rr);const Jl=Rr.exports;var $n,Gn;class Zl extends Si{constructor(e){super(e);C(this,$n,void 0);C(this,Gn,[]);_(this,$n,document.createElement("div")),_(this,Gn,new Array(3).fill(null).map((t,s)=>{const a=new Jl;return a.showPanel(s),a.dom.style.position="relative",m(this,$n).appendChild(a.dom),a})),e.addEventListener("prerender",this.prerenderListener.bind(this)),e.addEventListener("render",this.renderListener.bind(this)),e.controls.append(m(this,$n))}prerenderListener(){m(this,Gn).forEach(e=>e.begin())}renderListener(){m(this,Gn).forEach(e=>e.end())}get ready(){return!0}dispose(){const{parent:e}=this;e.controls.remove(m(this,$n)),e.removeEventListener("prerender",this.prerenderListener),e.removeEventListener("render",this.renderListener)}}$n=new WeakMap,Gn=new WeakMap;const na="foreseen-component",Nr=document.createElement("template");Nr.innerHTML=`
<style>
  :host, :host *, :host *:before, :host *:after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  :host {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .foreseen-dom {}
</style>

<div class="foreseen-dom"></div>
`;async function ea(){return typeof window<"u"&&typeof window.THREE<"u"?window.THREE:Zi(()=>import("./three.09c7a7c4.js"),[])}class ia extends Event{constructor(){super("ready")}}var Vn,kn,L,pi,ra,Re,Pr;class hi extends HTMLElement{constructor(){var t;super();C(this,pi);C(this,Re);C(this,Vn,"");C(this,kn,void 0);C(this,L,null);const e=this.attachShadow({mode:"open"});_(this,kn,e),_(this,Vn,((t=m(this,kn).host.textContent)==null?void 0:t.trim())||""),this.resize=this.resize.bind(this),e.appendChild(Nr.content.cloneNode(!0)),ea().then(s=>{var a,u;_(this,L,new Sr(s,"")),(a=m(this,L))==null||a.domElement.classList.add("foreseen-dom"),(u=B(this,Re,Pr).call(this,".foreseen-dom"))==null||u.replaceWith(m(this,L).domElement),this.resize(),this.dispatchEvent(new ia)})}static get observedAttributes(){return["editor"]}get ready(){return!!m(this,L)}get isRunning(){return!!m(this,L)&&m(this,L).isRunning}addEventListener(e,t,s){super.addEventListener(e,t,s)}addPlugins(...e){var t;if(!this.ready){this.addEventListener("ready",()=>this.addPlugins(...e),{once:!0});return}(t=m(this,L))==null||t.addPlugins(...e)}startRenderLoop(e=!0){var t;(t=m(this,L))==null||t.startRenderLoop(e)}stopRenderLoop(){var e;(e=m(this,L))==null||e.stopRenderLoop()}startAnimation(){var e;(e=m(this,L))==null||e.startAnimation()}pauseAnimation(){var e;(e=m(this,L))==null||e.pauseAnimation()}resumeAnimation(){var e;(e=m(this,L))==null||e.resumeAnimation()}stopAnimation(){var e;(e=m(this,L))==null||e.stopAnimation()}get data(){var e;return(e=m(this,L))==null?void 0:e.data}set onprerender(e){if(!m(this,L)){this.addEventListener("ready",()=>{this.onprerender=e});return}m(this,L).onprerender=e}get onprerender(){var e;return((e=m(this,L))==null?void 0:e.onprerender)||(()=>{})}set onrender(e){if(!m(this,L)){this.addEventListener("ready",()=>{this.onrender=e});return}m(this,L).onrender=e}get onrender(){var e;return((e=m(this,L))==null?void 0:e.onrender)||(()=>{})}get content(){return m(this,Vn)}set content(e){var t;if(!this.ready){this.addEventListener("ready",()=>{this.content=e});return}_(this,Vn,e),(t=m(this,L))==null||t.update(e).render()}resize(){var e;(e=m(this,L))==null||e.setSizeFromContainer(this)}connectedCallback(){typeof window<"u"&&window.addEventListener("resize",this.resize)}disconnectedCallback(){typeof window<"u"&&window.removeEventListener("resize",this.resize)}attributeChangedCallback(e,t,s){}}Vn=new WeakMap,kn=new WeakMap,L=new WeakMap,pi=new WeakSet,ra=function(e){return m(this,kn).querySelectorAll(e)},Re=new WeakSet,Pr=function(e){return m(this,kn).querySelector(e)},H(hi,"options",{});customElements.define(na,hi,hi.options);typeof window<"u"&&typeof window.Foreseen>"u"&&(window.Foreseen=Sr);const{demoSelectorContainer:ta,editorContainer:Ve}=window,Ur={defaultDemo:re,groupsDemo:ut,sunglassesDemo:ct},oa=Object.keys(Ur),ln=document.querySelector("foreseen-component");ln.addPlugins(Kl,Ql,Zl);ln.addEventListener("ready",()=>{ln.startRenderLoop(),ln.startAnimation()});let q;const sa=()=>{ln.content=(q==null?void 0:q.getValue())||""},Ii=document.createElement("select");Ii.addEventListener("change",function(){const n=Ur[this.value];q==null||q.setValue(n),ln.content=n});oa.forEach((n,i)=>{const e=document.createElement("option");e.value=n,e.textContent=n.replace(/Demo$/,""),e.selected=i===0,Ii.appendChild(e)});ta.appendChild(Ii);ln.addEventListener("ready",()=>{q&&q.setValue(re),ln.content=re});window.addEventListener("load",()=>{Zi(()=>import("./custom-monaco.48ec587a.js"),["assets/custom-monaco.48ec587a.js","assets/custom-monaco.0b03969d.css","assets/lodash.c11a6a11.js"]).then(({monaco:n})=>{q=n.editor.create(Ve,{wordWrap:"on",automaticLayout:!0,value:ln.content,language:"yaml",insertSpaces:!0,tabSize:2}),q.onKeyUp(sa),q.addCommand(n.KeyCode.F4,function(){document.body.classList.toggle("bragger"),Ve.style.width="",Ve.style.height="",q==null||q.layout()}),q.setValue(re),ln.content=re})});window.instance=ln;export{Zi as _};
