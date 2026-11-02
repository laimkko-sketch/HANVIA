// 자동 생성: New-Machine_V01/index.html 의 설비 모델(LVT 인라인 라인)을 공장 주동(북측)에 넣기 위한 모듈.
// 원본 좌표계 그대로(5동 X/Z, 바닥 y=0). 건물·바닥 이미지·라벨·UI·자체 SILO·DOTP 저장탱크는 제외.
import * as THREE from 'three';
export function buildMachine(root){
const scene=root; let T=0;
const ZU=15.48, ZL=20.98, UC={x:16.25,z:18.23,r:2.75};
/* ---------- materials ---------- */
const MATS=[];
function M(color,o={}){const m=new THREE.MeshStandardMaterial({color,roughness:o.r??0.6,metalness:o.m??0.25,transparent:!!o.t,opacity:o.t??1,emissive:o.e??0x000000,emissiveIntensity:o.ei??1,side:o.ds?THREE.DoubleSide:THREE.FrontSide,depthWrite:o.t?false:true});MATS.push(m);return m;}
const C={frame:0x6e7d8c,steel:0xa9b4bf,dark:0x39424c,green:0x3f8f5a,ivory:0xe4e0d2,blue:0x2f6fae,yellow:0xe0b23a,orange:0xd9762b,red:0xc0392b,roll:0xc9ced4,silo:0xd8dde2,belt:0x232a31,motor:0x2f7d4f,uv:0x6b46c1};

/* ---------- builder helpers (all return mesh, add to current group) ---------- */
let G=null; // current group
function add(o){(G||scene).add(o);return o;}
function box(w,h,d,col,x,y,z,o={}){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),o.mat||M(col,o));m.position.set(x,y+h/2,z);m.castShadow=o.cs??true;m.receiveShadow=true;if(o.ry)m.rotation.y=o.ry;return add(m);}
function cyl(r,len,col,x,y,z,axis='y',o={}){const m=new THREE.Mesh(new THREE.CylinderGeometry(o.r2??r,r,len,o.seg??28,1,!!o.open),o.mat||M(col,o));m.position.set(x,y,z);if(axis==='x')m.rotation.z=Math.PI/2;if(axis==='z')m.rotation.x=Math.PI/2;m.castShadow=true;m.receiveShadow=true;return add(m);}
function legs(x1,x2,z1,z2,h,col=C.frame,s=0.12){for(const x of [x1,x2])for(const z of [z1,z2])box(s,h,s,col,x,0,z);}
// straight conveyor along X at lane z
function conveyor(x1,x2,z,w=1.5,h=0.95,o={}){
  const L=Math.abs(x2-x1),cx=(x1+x2)/2;
  box(L,0.14,0.1,o.col??C.frame,cx,h-0.14,z-w/2);box(L,0.14,0.1,o.col??C.frame,cx,h-0.14,z+w/2);
  const n=Math.max(2,Math.floor(L/(o.pitch??0.35)));
  const g=new THREE.CylinderGeometry(0.045,0.045,w-0.05,12); g.rotateX(Math.PI/2);
  const im=new THREE.InstancedMesh(g,M(C.roll,{m:.6,r:.35}),n);const mt=new THREE.Matrix4();
  for(let i=0;i<n;i++){mt.makeTranslation(Math.min(x1,x2)+L*(i+.5)/n,h-0.05,z);im.setMatrixAt(i,mt);} im.castShadow=true; add(im);
  const ls=Math.max(2,Math.ceil(L/2.4));for(let i=0;i<=ls;i++){const x=Math.min(x1,x2)+L*i/ls;box(0.08,h-0.14,0.08,C.frame,x,0,z-w/2);box(0.08,h-0.14,0.08,C.frame,x,0,z+w/2);}
}
function tank(x1,x2,z,w,h,water,o={}){
  const L=x2-x1,cx=(x1+x2)/2,t=0.06,col=o.col??0x8796a4;
  box(L,h,t,col,cx,0,z-w/2);box(L,h,t,col,cx,0,z+w/2);box(t,h,w,col,x1,0,z);box(t,h,w,col,x2,0,z);
  box(L,0.06,w,col,cx,0,z);
  const wm=new THREE.Mesh(new THREE.BoxGeometry(L-0.1,h*0.78,w-0.1),M(water,{t:0.55,r:0.15,m:0}));wm.position.set(cx,h*0.39+0.03,z);add(wm);
  box(L,0.06,0.18,col,cx,h,z-w/2);box(L,0.06,0.18,col,cx,h,z+w/2);
  const n=Math.floor(L/0.6);const g=new THREE.CylinderGeometry(0.05,0.05,w-0.12,12);g.rotateX(Math.PI/2);
  const im=new THREE.InstancedMesh(g,M(C.roll,{m:.6}),n);const mt=new THREE.Matrix4();
  for(let i=0;i<n;i++){mt.makeTranslation(x1+L*(i+.5)/n,h*0.7,z);im.setMatrixAt(i,mt);} add(im);
}
function rail(pts,y,h=1.1){for(let i=0;i<pts.length-1;i++){const [a,b]=[pts[i],pts[i+1]];const dx=b[0]-a[0],dz=b[1]-a[1],L=Math.hypot(dx,dz),ang=Math.atan2(dz,dx);
  const m=box(L,0.05,0.05,C.yellow,(a[0]+b[0])/2,y+h,(a[1]+b[1])/2);m.rotation.y=-ang;const m2=box(L,0.04,0.04,C.yellow,(a[0]+b[0])/2,y+h/2,(a[1]+b[1])/2);m2.rotation.y=-ang;
  const n=Math.max(1,Math.round(L/1.1));for(let k=0;k<=n;k++)box(0.05,h,0.05,C.yellow,a[0]+dx*k/n,y,a[1]+dz*k/n);}}
function pipe(points,r=0.09,col=0xc8cdd2){const c=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)),false,'catmullrom',0.02);const m=new THREE.Mesh(new THREE.TubeGeometry(c,Math.max(20,points.length*14),r,10,false),M(col,{m:.6,r:.3}));m.castShadow=true;return add(m);}

/* ---------- steps ---------- */
const STEPS=[
 {id:'silo',name:'SILO',sub:'원료 사일로 (PVC·CaCO3)',src:'B1 신공장 5동 SILO LAY-OUT · 5동 배치도',dim:'∅3,440 (Skirt O.D) × 2기, 100㎥급 · 공압 이송/계량 시스템(P&ID TB20029A)'},
 {id:'f2',name:'반바리 2층',sub:'고운 수지류 자동계량 · 수동 투입층',src:'반바리 가대 및 계단 201123 · P&ID TB20029A',dim:'2층 작업층(추정 EL+6.0m) · PVC·CaCO3 공압 이송 → 계량 호퍼 자동계량 · 액상가소제(DOTP) 저장탱크 → 펌프 → 2층 계량탱크 자동계량'},
 {id:'smix',name:'슈퍼믹서',sub:'PVC · CaCO3 · 액상가소제 혼합',src:'P&ID TB20029A (SUPER/COOLING MIXER)',dim:'자동계량된 PVC·CaCO3(분체)와 액상가소제를 고속 혼합 → 반바리 투입 슈트로 낙하'},
 {id:'banb',name:'반바리',sub:'160L Banbury × 2',src:'160L B-MIXER FOUNDATION 201106 · 반바리 가대 201119/201123',dim:'반바리 입구에서 작업자가 안료·분말안정제를 소량 수동 투입 · 배출 1배치 150L(약 260kg) 덩어리, 3분 주기로 압출기 이송 · 가대 8,725 × 7,215, B/M 16 ton'},
 {id:'ext',name:'압출기',sub:'덩어리 투입 → 15cm 스트립 연속 압출',src:'5동 배치도 · 24" CALENDER LINE LAY-OUT',dim:'반바리 배출 컨베이어로 260kg 덩어리 투입(3분 주기) → 폭 약 150mm 스트립으로 길게 연속 압출'},
 {id:'swing',name:'스윙컨베어 이송',sub:'15cm 스트립 → 캘린더 닙',src:'5동 배치도 · 스윙컨베어 도면 201109',dim:'폭 약 150mm 연속 스트립을 캘린더 롤 폭 방향으로 왕복 스윙하며 닙(뱅크)에 균일 공급'},
 {id:'cal',name:'캘린더 압연가공',sub:'4-Bowl ∅24"×76"L',src:'24" CALENDER LINE LAY-OUT (DK-TURK-DE001/002) · 상지 인라인 기초도',dim:'롤 ∅610 × 1,930L × 4 · 메인모터 55kW'},
 {id:'lami',name:'인라인 합지 (적층형)',sub:'공정투입(피트) → 라미1~라미6 · 합판히터 · 2층 언와인더',src:'LAMI003 201014 (LAMINATING 23,062 입면) · 일신케미칼 전체 LAY-OUT (210112)',dim:'캘린더 직후 피트(깊이 2.2m) 언와인더 2롤에서 베이스층 공정투입 → 라미1~라미6 닙 유닛(@3.9m) · 각 라미 상부 2층(EL+2.4m)에 언와인더 2롤(사용/대기), 최상부 약 3.9m · 라미 사이 합판히터(2kW×51EA=102kW 등)로 시트 상부 가열 · 라미3까지 진그레이, 라미4부터 나무무늬 · 2층에서 원단 연결·투입 작업자 상주'},
 {id:'embo',name:'엠보롤 성형',sub:'IR 히터 → 수직 낙하 → 엠보롤·고무롤',src:'LAMI003 201014 · 공정 설명',dim:'라미6 직후 IR 히터판 약 2.5m로 표면 가열 → 제품이 거의 수직으로 떨어지며 한쪽 엠보롤(금속)과 반대쪽 고무롤 닙에서 표면 질감 형성 · 별도 대형 프레임 없음 → 경사 컨베이어로 수세조 이송'},
 {id:'wash',name:'수세조 (냉각)',sub:'1차 수조 냉각',src:'LAMI003 201014 · 인라인 수조 배치도(10.13)',dim:'엠보 후 경사 가이드롤 컨베이어로 이송 → 수세조 약 12.3m × 폭 2.8m (1차 수조 냉각 구간)'},
 {id:'cut',name:'원장 커팅 (길로틴)',sub:'Guillotine Cutter',src:'LAMI003 201014',dim:'CUTTING 구간 10,004 (분배 포함)'},
 {id:'anneal',name:'수조 어닐링',sub:'열탕 90℃ → 중탕 50℃ → 냉탕 25℃',src:'인라인 수조 배치도면(2020.10.08/10.13) · LAMI003',dim:'열탕 약 90℃ (2세트 14,500) → 중탕 약 50℃ (2세트 8,040) → 냉탕 약 25℃ (2세트 11,690) · 단계적으로 온도를 낮춰 내부 응력 완화 · 단일 경로 · 90° U-TURN 후 UV 공정'},
 {id:'uvc',name:'UV 코팅',sub:'가열평활기 · 롤코팅기 · 건조기',src:'UV Coating line LAY-OUT (IL SHIN 2020.09.17) · UV7-1400W',dim:'폭 1,420 · 평활기 4m · 건조기 3m'},
 {id:'uvx',name:'UV 경화',sub:'UV 경화기 7조 + UV 자연냉각',src:'UV7-1400W LAY-OUT (CL-uv7-1400-0001) · IN LINE 2호기 LAY-OUT',dim:'UV경화기 7조 · 블로워 0.75kW · 경화 후 U.V 자연냉각 컨베이어 7,650'},
 {id:'wtr',name:'수조이송 (냉탕)',sub:'재단 적합 온도 약 24℃ 세팅',src:'인라인 수조 배치도면 · 5동 배치도',dim:'마지막 냉탕 (2세트 10,600) · 제품을 톰슨프레스 재단에 적합한 약 24℃로 맞춤 → 프레스 2대로 분배'},
 {id:'press',name:'톰슨프레스 재단',sub:'프레스 <6.3M> × 2',src:'5동 배치도 (프레스<6.3M>)',dim:'원장이 컨베이어 높이(FL+1.0) 그대로 평평하게 투입 → 프레스 아래 정지 → 원장 1장당 1타 → 작은 최종 치수(예시 2×2 = 4매)로 재단 배출 · 프레스 2대 교대 공급'},
 {id:'insp',name:'육안 검사',sub:'형광등 검사대 · 양쪽 여성 검사원',src:'공정 설명 기준 (톰슨프레스 → 박스포장 사이)',dim:'검사대 높이 FL+1.0 (톰슨프레스 베드와 동일) · 상부 형광등(2등용 × 2열)으로 조도 확보 · 컨베이어 양쪽에서 낱장 외관 육안 검사 · 라인당 4명'},
 {id:'box',name:'박스 포장',sub:'낱장 적층 → 핫멜트 박스 포장 · 라벨러 · 적재 × 2열',src:'일신케미칼 IN LINE 2호기 LAY-OUT (포장기·LABELLER·포장 적재용)',dim:'톰슨프레스 재단 낱장 → CONVEYOR SYSTEM → 낱장 적층(일정 매수) → 핫멜트 박스 포장 → LABELLER → TURN/ROLLER CONVEYOR → 팔레트 위 박스 적재(예: 6박스 × 4단)'},
 {id:'fork',name:'지게차 이송',sub:'포장 팔레트 → 래핑기 → 적재장',src:'공정 설명 기준 (도면 동선 없음 · 개략 동선)',dim:'2열 포장 스테이션에서 번갈아 팔레트 픽업 → 자동 래핑기 투입 → 래핑 완료 후 적재장 이동'},
 {id:'wrap',name:'자동 래핑기',sub:'턴테이블식 스트레치 래핑',src:'공정 설명 기준 (위치·크기 추정)',dim:'턴테이블 ∅2.0m · 마스트 3.0m · 필름 캐리지 상하 왕복'},
 {id:'store',name:'팔레트 적재',sub:'완제품 팔레트 2단 적재 → 출하',src:'공정 설명 기준 (위치 추정)',dim:'완제품 적재장 약 12 × 10m · 중앙 지게차 통로 양측 적재 · 8열 × 4줄 × 2단 = 64 팔레트 규모'}
];
const GROUPS={}; const LBL={};
function begin(id){G=new THREE.Group();G.name=id;GROUPS[id]=G;scene.add(G);return G;}
function end(){G=null;}
/* ===== 1. SILO ===== */
begin('silo');
for(const [x,z] of [[145.0,14.5],[149.3,14.9]]){
  box(4.4,0.4,4.4,0x9aa3ab,x,0,z);
  for(const a of [0,1,2,3]){const ang=a*Math.PI/2+Math.PI/4;box(0.3,4.2,0.3,C.frame,x+1.45*Math.cos(ang),0.4,z+1.45*Math.sin(ang));}
  cyl(1.72,1.0,C.dark,x,4.7,z,'y',{seg:36});
  const cone=new THREE.Mesh(new THREE.ConeGeometry(1.72,2.6,36),M(C.silo,{m:.5,r:.35}));cone.rotation.x=Math.PI;cone.position.set(x,6.5,z);add(cone);
  cyl(1.72,10.5,C.silo,x,13.05,z,'y',{seg:36,m:.5,r:.35});
  const top=new THREE.Mesh(new THREE.ConeGeometry(1.75,0.9,36),M(C.silo,{m:.5,r:.35}));top.position.set(x,18.75,z);add(top);
  cyl(0.25,0.6,C.dark,x,19.4,z);
  // ladder
  box(0.5,14,0.06,C.yellow,x+1.8,4.6,z);
}
pipe([[145,19.3,14.5],[145,20,14.5],[140,20,13.8],[132,8.2,12.6],[129.6,7.8,12.4]],0.09);
pipe([[149.3,19.3,14.9],[149.3,20.5,14.9],[140,20.5,14.3],[132,8.6,13.6],[129.6,8.0,13.8]],0.09);
// blower room
box(2.0,3.4,4.2,0x7b8794,133.2,0,16.0,{r:.8,m:.05});
end();

/* ===== 4. 반바리 (platform at deck 1.2) + 2. 2층 + 3. 슈퍼믹서 ===== */
begin('banb');
const DK=1.2; // 가대 상부
box(7.4,0.25,8.0,0x56616d,126.1,DK-0.25,14.1);
for(const x of [122.6,124.6,126.6,128.6,129.6])for(const z of [10.3,14.1,17.9])box(0.3,DK-0.25,0.3,C.frame,x,0,z);
rail([[122.4,10.1],[129.8,10.1],[129.8,18.1],[122.4,18.1]],DK);
// stair (26°) to deck
for(let i=0;i<5;i++)box(1.0,0.05,0.28,C.frame,121.9-i*0.27,DK-0.24*(i+1),17.4);
for(const [x,z] of [[123.75,15.5],[127.25,15.5]]){
  box(2.1,2.0,2.4,C.ivory,x,DK,z,{m:.35});           // mixing chamber
  box(1.4,1.6,1.6,C.ivory,x,DK+2.0,z,{m:.35});       // feed hopper / neck
  cyl(0.28,1.6,C.steel,x,DK+4.4,z,'y',{m:.7});      // ram cylinder
  box(1.0,0.5,1.0,C.dark,x,DK+5.1,z);
  box(1.6,1.2,1.6,C.orange,x,DK,z-2.1);              // reducer 8t
  cyl(0.55,1.6,C.motor,x,DK+0.6,z-3.6,'z');          // motor 6t
  box(0.9,0.5,0.9,C.dark,x,0.7,z);                   // drop door (하부 배출)
  // 2층 수동 투입구 (안료·분말안정제 소량 투입) — 반바리 입구로 연결
  const fz=z+1.15;
  const fn=new THREE.Mesh(new THREE.CylinderGeometry(0.45,0.18,0.6,4,1,true),M(0xb0b8c0,{m:.5,ds:true}));fn.rotation.y=Math.PI/4;fn.position.set(x+0.55,6.25,fz);add(fn);
  pipe([[x+0.55,5.95,fz],[x+0.45,5.3,z+0.85],[x+0.3,DK+3.5,z+0.6]],0.13,0xb0b8c0);
}
end();
begin('f2');
const EL2=6.0;
box(9.4,0.25,9.6,0x4e5864,126.3,EL2-0.25,14.2,{t:0.92});
for(const x of [121.8,126.3,130.8])for(const z of [9.6,18.8])box(0.35,EL2-0.25,0.35,C.frame,x,0,z);
rail([[121.6,9.4],[131.0,9.4],[131.0,19.0],[121.6,19.0]],EL2);
for(let i=0;i<20;i++)box(1.1,0.05,0.3,C.frame,121.0,EL2-0.3*(i+1),10.6+i*0.4);
// 계량 호퍼 (PVC / CaCO3) + 집진
for(const [x,z,c] of [[129.0,12.2,0xd5dbe1],[129.0,14.2,0xd5dbe1]]){
  cyl(0.7,1.4,c,x,EL2+1.3,z,'y',{m:.5});
  const k=new THREE.Mesh(new THREE.ConeGeometry(0.7,0.8,24),M(c,{m:.5}));k.rotation.x=Math.PI;k.position.set(x,EL2+0.2,z);add(k);
  legs(x-0.6,x+0.6,z-0.6,z+0.6,0.6,C.frame,0.08);
}
box(1.2,2.0,1.2,0x8a96a3,130.2,EL2,17.6); // bag filter
// 액상가소제(DOTP) 자동계량 탱크 (2층)
cyl(0.45,1.0,0xe8d27a,128.6,EL2+1.1,16.4,'y',{m:.5});legs(128.25,128.95,16.05,16.75,0.6,C.frame,0.07);
for(const x of [123.75,127.25])pipe([[128.6,EL2+0.6,16.4],[128.0,EL2+2.3,15.6],[x+0.4,EL2+2.3,14.2],[x+0.4,EL2+1.95,13.8]],0.05,0xd4b84a);
// 안료·분말안정제 포대 (소량 수동 투입용)
box(1.2,0.12,1.0,0x9c7a4a,125.5,EL2,18.2);
for(let k=0;k<8;k++){const cc=[0x2c3e50,0x2e86c1,0xecf0f1,0xc0392b][k%4];box(0.5,0.16,0.35,cc,125.25+(k%2)*0.5,EL2+0.12+Math.floor(k/2)*0.17,18.0+((k>>1)%2)*0.4,{m:0,r:.9});}
end();
begin('smix');
for(const x of [123.75,127.25]){
  cyl(0.75,1.3,0xdfe4e8,x,EL2+1.25,13.6,'y',{m:.55,r:.3});
  cyl(0.78,0.12,C.dark,x,EL2+1.95,13.6);
  cyl(0.32,0.9,C.motor,x,EL2+2.45,13.6);
  legs(x-0.65,x+0.65,12.95,14.25,0.6,C.frame,0.1);
  pipe([[x,EL2+0.55,13.6],[x,EL2-0.2,14.3],[x,DK+5.4,15.2],[x,DK+3.7,15.5]],0.16,0xbfc5cb);
}
end();

// 반바리 입구 수동 투입 작업자 (2층)
G=GROUPS.banb;person(124.9,EL2,16.9);person(128.3,EL2,17.0,0x2e86c1);G=null;

/* ===== 5. 압출기 ===== */
begin('ext');
cyl(0.36,3.2,0xe2c044,116.3,1.25,15.3,'x',{m:.5});        // planetary barrel
cyl(0.42,0.3,C.dark,114.75,1.25,15.3,'x');                 // die
box(2.2,1.5,1.4,C.yellow,119.0,0.0,15.3,{m:.4});          // gearbox
cyl(0.5,1.4,C.motor,119.0,1.0,16.6,'z');                  // motor
legs(115,117.8,14.9,15.7,0.9,C.frame,0.12);
const hop=new THREE.Mesh(new THREE.CylinderGeometry(0.55,0.2,0.9,20),M(C.yellow,{m:.4}));hop.position.set(117.5,2.05,15.3);add(hop);
// 반바리 배출 → 압출기 호퍼 경사 컨베이어
box(5.4,0.12,0.9,C.belt,125.7,0.19,15.4);for(const x of [123.4,125.7,128.0])box(0.1,0.19,0.1,C.frame,x,0,15.4);
for(const dz of [-0.5,0.5])box(5.4,0.22,0.06,C.frame,125.7,0.19,15.4+dz);
{const x1=123.0,x2=117.9,y1=0.25,y2=2.6;const L=Math.hypot(x1-x2,y2-y1);const b=box(L,0.12,0.9,C.belt,(x1+x2)/2,(y1+y2)/2-0.06,15.4);b.rotation.z=-Math.atan2(y2-y1,x1-x2);
 for(const x of [119,121,122.6])box(0.1,y1+(x1-x)/(x1-x2)*(y2-y1)-0.12,0.1,C.frame,x,0,15.4);}
end();

/* ===== 6. 스윙컨베어 ===== */
const stripTex=(()=>{const c=document.createElement('canvas');c.width=256;c.height=16;const x=c.getContext('2d');x.fillStyle='#b9b39c';x.fillRect(0,0,256,16);for(let i=0;i<256;i+=32){x.fillStyle='#a39d86';x.fillRect(i,0,12,16);}const t=new THREE.CanvasTexture(c);t.wrapS=THREE.RepeatWrapping;t.repeat.set(4,1);t.colorSpace=THREE.SRGBColorSpace;return t;})();
begin('swing');
const swingPivot=new THREE.Group();swingPivot.position.set(114.7,1.1,15.3);G.add(swingPivot);
{const L=3.2;const g=new THREE.Group();const b=new THREE.Mesh(new THREE.BoxGeometry(L,0.1,0.55),M(C.belt));b.position.set(-L/2,0,0);g.add(b);
 const s1=new THREE.Mesh(new THREE.BoxGeometry(L,0.18,0.06),M(C.yellow,{m:.4}));s1.position.set(-L/2,0.05,-0.3);g.add(s1);const s2=s1.clone();s2.position.z=0.3;g.add(s2);
 // 압출 스트립 (폭 약 150mm) — 벨트 위로 연속 이송
 const stripM=new THREE.MeshStandardMaterial({map:stripTex,roughness:.7});
 const st=new THREE.Mesh(new THREE.BoxGeometry(L+0.15,0.035,0.15),stripM);st.position.set(-L/2-0.05,0.07,0);g.add(st);
 g.rotation.z=-0.22; swingPivot.add(g); swingPivot.userData.belt=g;}
box(0.6,1.0,0.6,C.frame,114.7,0,15.3);
end();

/* ===== 7. 캘린더 ===== */
begin('cal');
const CX=111.1;
for(const z of [14.25,16.75]){box(2.4,3.9,0.32,0x3e6f99,CX,0,z,{m:.35});}
box(2.6,0.4,3.0,0x2f3b47,CX,0,15.5);
const calRolls=[];
for(const [dx,y] of [[0.35,1.25],[-0.32,1.25],[-0.32,1.9],[-0.32,2.55]]){const r=cyl(0.305,1.93,0xdfe3e7,CX+dx,y,15.5,'z',{m:.85,r:.15});calRolls.push(r);}
cyl(0.18,0.6,C.dark,CX-0.3,3.7,15.5,'x');
const calBank=cyl(0.13,1.2,0x9aa088,CX+0.02,1.62,15.5,'z',{m:0,r:.8}); // 캘린더 닙 뱅크
// drives (north)
for(let i=0;i<4;i++){box(0.9,0.9,1.1,C.orange,CX-0.6+i*0.4,0.4+i*0.55,13.3);}
box(2.3,1.4,1.6,C.dark,CX,0,11.6);
cyl(0.55,1.7,C.motor,CX,0.95,10.4,'z');
box(1.6,1.2,1.0,0x56616d,CX+0.2,0,17.9);
end();

/* ===== 8. 인라인 합지 (적층형) — 2층 원단 투입 구조 =====
   기준: 일신케미칼 전체 LAY-OUT(210112) 합지부 — 캘린더 직후 바로 합지 5스테이션(@3.9m),
   상부 2층 작업대(약 20.4 × 7.9m)에서 인쇄지·반제품 원단을 연결/투입, 남측 계단 */
begin('lami');
const LEL=2.4;                                   // 2층 작업대(상부 보) 높이 — LAMI003 입면도 기준 약 2.4m, 언와인더 최상부 약 3.9m
const LST=[107.85,103.95,100.05,96.15,92.25,88.35];    // 라미1~라미6 중심 (캘린더 쪽부터, @3.9m)
const DX0=85.25,DX1=109.6,DZ0=ZU-5.25,DZ1=ZU+2.6;
const PIT={x0:101.9,x1:108.2,z0:ZU-2.2,z1:ZU+2.2,d:2.2};   // 공정투입 피트 (깊이 2.2m)
conveyor(84.3,109.9,ZU,1.6,1.0,{pitch:0.45});
const LAMI_TAGS=[['공정투입',105.6,ZU],...LST.map((x,i)=>['라미'+(i+1),x,ZU])];
const lamiRolls=[],heaterPlates=[];
function person(x,y,z,vest=0xf39c12){
  box(0.16,0.85,0.16,0x2c3e50,x-0.1,y,z);box(0.16,0.85,0.16,0x2c3e50,x+0.1,y,z);
  box(0.46,0.7,0.28,vest,x,y+0.85,z,{m:0,r:.8});
  const h=new THREE.Mesh(new THREE.SphereGeometry(0.13,14,10),M(0xe0b090,{m:0,r:.9}));h.position.set(x,y+1.72,z);add(h);
  const hm=new THREE.Mesh(new THREE.SphereGeometry(0.15,14,8,0,Math.PI*2,0,Math.PI/2),M(0xf1c40f,{m:0,r:.5}));hm.position.set(x,y+1.76,z);add(hm);
}
function web(ax,ay,bx,by,z,w=1.4){const dx=bx-ax,dy=by-ay,L=Math.hypot(dx,dy);const g=new THREE.Group();g.position.set((ax+bx)/2,(ay+by)/2,z);g.rotation.z=Math.atan2(dy,dx);
  const m=new THREE.Mesh(new THREE.PlaneGeometry(L,w),M(0xf2e6c4,{t:.85,ds:true,m:0}));m.rotation.x=Math.PI/2;g.add(m);add(g);}
function heaterPlate(x0,x1,kw){ // 합판히터: 2층 보에 매달린 판형 히터 (시트 상부 FL+1.28~1.42)
  const L=x1-x0,cx=(x0+x1)/2;
  box(L,0.12,1.5,0x4a525c,cx,1.3,ZU,{m:.5});
  heaterPlates.push(box(L-0.08,0.02,1.4,0xff6a2a,cx,1.28,ZU,{e:0xff4a10,ei:1.4,m:0}));
  const n=Math.max(2,Math.round(L/1.2));for(let k=0;k<n;k++)for(const dz of [-0.6,0.6])box(0.03,LEL-0.12-1.42,0.03,C.steel,x0+0.15+(L-0.3)*k/(n-1),1.42,ZU+dz,{m:.8,cs:false});
}
for(const [i,x] of LST.entries()){
  // 합지 닙 유닛 (상·하 압착롤) — 2층 보 아래 콤팩트 유닛
  for(const z of [ZU-1.05,ZU+1.05])box(0.9,1.9,0.18,0x3e6f99,x,0,z,{m:.35});
  lamiRolls.push(cyl(0.18,1.8,0xd9dde2,x,1.27,ZU,'z',{m:.85,r:.2}));
  lamiRolls.push(cyl(0.18,1.8,0x2a2f35,x,0.85,ZU,'z',{m:.2,r:.8}));
  for(const dz of [-0.7,0.7])cyl(0.06,0.4,C.steel,x,1.7,ZU+dz,'y',{m:.8});   // 가압 실린더
  box(0.7,0.7,0.6,C.motor,x+0.1,0,ZU+2.6);
  // 2층: 언와인더 2롤 (인쇄지/반제품 — 사용 + 대기)
  for(const [k,dx] of [[0,-0.6],[1,0.6]]){
    box(0.7,0.55,1.7,0x56616d,x+dx,LEL,ZU);
    cyl(0.05,2.0,C.steel,x+dx,LEL+0.97,ZU,'z',{m:.8});
    lamiRolls.push(cyl(0.54,1.45,(i+k)%2?0xb7c7d6:0xe8d6a8,x+dx,LEL+0.97,ZU,'z',{m:.05,r:.8}));
  }
  cyl(0.07,1.7,C.steel,x+0.2,LEL+0.25,ZU,'z',{m:.8});        // 가이드롤
  web(x-0.75,LEL+0.6,x+0.2,LEL+0.22,ZU);                      // 언와인더 → 가이드롤
  web(x+0.2,LEL+0.22,x+0.05,1.45,ZU);                          // 개구부 통과 → 닙
}
// 합판히터 — 각 라미 사이 구간 + 캘린더~라미1 경사 구간 (도면: 2KW×51EA=102KW 등)
heaterPlate(108.45,110.3);
for(let i=0;i<LST.length-1;i++)heaterPlate(LST[i+1]+0.55,LST[i]-0.55);
// 공정투입 피트 (깊이 2.2m) — 베이스층 원단 언와인더 2롤, 수직 상승하여 라미1 닙으로 투입
{const cx=(PIT.x0+PIT.x1)/2,cz=(PIT.z0+PIT.z1)/2,W=PIT.x1-PIT.x0,D=PIT.z1-PIT.z0,cM=0x3f4a44;
 box(W,0.1,D,cM,cx,-PIT.d,cz,{r:.95,m:0});
 box(W,PIT.d,0.2,cM,cx,-PIT.d,PIT.z0,{r:.95,m:0});box(W,PIT.d,0.2,cM,cx,-PIT.d,PIT.z1,{r:.95,m:0});
 box(0.2,PIT.d,D,cM,PIT.x0,-PIT.d,cz,{r:.95,m:0});box(0.2,PIT.d,D,cM,PIT.x1,-PIT.d,cz,{r:.95,m:0});
 for(const x of [103.6,105.1]){box(0.8,0.7,1.7,0x56616d,x,-PIT.d+0.1,ZU);cyl(0.05,2.0,C.steel,x,-PIT.d+1.5,ZU,'z',{m:.8});lamiRolls.push(cyl(0.54,1.45,0xcfc6b4,x,-PIT.d+1.5,ZU,'z',{m:.05,r:.8}));}
 cyl(0.08,1.7,C.steel,107.5,-PIT.d+0.5,ZU,'z',{m:.8});
 web(105.1,-PIT.d+0.97,107.5,-PIT.d+0.42,ZU);web(107.58,-PIT.d+0.5,107.58,0.8,ZU);web(107.58,0.8,107.85,0.67,ZU);
 for(const y of [-0.9,0.2])cyl(0.06,1.7,C.steel,107.65,y,ZU,'z',{m:.8});
 box(0.15,PIT.d+0.9,0.15,C.frame,107.8,-PIT.d,ZU-0.9);box(0.15,PIT.d+0.9,0.15,C.frame,107.8,-PIT.d,ZU+0.9);
 rail([[PIT.x0,PIT.z0],[PIT.x1,PIT.z0]],0,1.0);rail([[PIT.x0,PIT.z1],[PIT.x1,PIT.z1]],0,1.0);
 person(104.35,-PIT.d+0.1,ZU+1.4);}
// 2층 작업대 (그레이팅)
const gM=M(0x6b7785,{t:0.82,m:.3,r:.6});
box(DX1-DX0,0.12,(ZU-1.3)-DZ0,0,(DX0+DX1)/2,LEL-0.12,(DZ0+ZU-1.3)/2,{mat:gM});
box(DX1-DX0,0.12,DZ1-(ZU+1.1),0,(DX0+DX1)/2,LEL-0.12,(ZU+1.1+DZ1)/2,{mat:gM});
{const edges=[DX0,DX1]; // 그레이팅 (원단은 그레이팅 사이로 통과)
 for(let k=0;k<edges.length;k+=2){const a=edges[k],b=edges[k+1];if(b-a>0.05)box(b-a,0.12,2.4,0,(a+b)/2,LEL-0.12,ZU-0.1,{mat:gM});}}
// 기둥 · 보
for(let x=DX0;x<=DX1+0.01;x+=(DX1-DX0)/5)for(const z of [DZ0,DZ1])box(0.25,LEL-0.12,0.25,C.frame,x,0,z);
for(const z of [DZ0,DZ1])box(DX1-DX0,0.3,0.2,C.frame,(DX0+DX1)/2,LEL-0.42,z);
// 안전난간 (계단 진입부 제외)
rail([[95.2,DZ1],[DX0,DZ1],[DX0,DZ0],[DX1,DZ0],[DX1,DZ1],[96.6,DZ1]],LEL);
// 남측 계단 (1층 → 2층)
{const n=14,x0=92.8,x1=96.4,zc=DZ1+0.65;for(let k=0;k<n;k++)box(0.3,0.05,1.0,C.frame,x0+(x1-x0)*(k+0.5)/n,LEL*(k+1)/n-0.05,zc);
 for(const dz of [-0.55,0.55]){const L=Math.hypot(x1-x0,LEL);const st=box(L,0.18,0.06,C.yellow,(x0+x1)/2,LEL/2-0.09,zc+dz);st.rotation.z=Math.atan2(LEL,x1-x0);
  const hr=box(L,0.05,0.05,C.yellow,(x0+x1)/2,LEL/2+0.9,zc+dz);hr.rotation.z=Math.atan2(LEL,x1-x0);}
 box(1.2,0.08,1.3,C.frame,96.9,LEL-0.08,zc);}
// 2층 예비 원단 적치 (북측)
for(const x of [88.5,92.5,96.5,100.5,104.5]){box(1.8,0.12,1.2,0x9c7a4a,x,LEL,DZ0+1.1);for(const dx of [-0.45,0.45])cyl(0.4,1.4,dx<0?0xe8d6a8:0xb7c7d6,x+dx,LEL+0.52,DZ0+1.1,'z',{m:.05,r:.8});}
// 2층 원단 연결(투입) 작업자 — 항시 상주
person(106.6,LEL,ZU-1.9);person(99.0,LEL,ZU-1.9,0x2e86c1);person(94.9,LEL,ZU+1.6);
end();

/* ===== 9. 엠보롤 성형 =====
   라미6 직후 IR 히터판(약 2.5m)으로 표면 가열 → 제품이 거의 수직으로 떨어지며
   한쪽 엠보롤(금속) + 반대쪽 고무롤 닙에서 질감 형성 · 별도 대형 프레임 없음 */
begin('embo');
const EMB={nx:83.7,ny:0.5,r:0.35};            // 닙 위치
// IR 히터판 (2.5m) — 시트 상부
box(2.5,0.22,1.7,0x3a3f45,86.15,1.42,ZU,{m:.4});
const irPanel=box(2.4,0.03,1.55,0xff6a2a,86.15,1.39,ZU,{e:0xff4a10,ei:1.8,m:0});
for(const x of [85.0,87.3])for(const dz of [-0.9,0.9])box(0.06,1.42,0.06,C.frame,x,0,ZU+dz);
box(0.35,0.3,0.4,0x2f3b47,86.15,1.64,ZU-0.95);
// 가이드롤 → 수직 낙하
const guide=cyl(0.08,1.7,C.steel,EMB.nx+0.08,0.98,ZU,'z',{m:.9});
// 엠보롤(하류측, 금속) + 고무롤(상류측)
const emboRolls=[cyl(EMB.r,1.8,0xaab3bc,EMB.nx-EMB.r-0.01,EMB.ny,ZU,'z',{m:.95,r:.3}),cyl(EMB.r,1.8,0x23272c,EMB.nx+EMB.r+0.01,EMB.ny,ZU,'z',{m:.05,r:.95}),guide];
for(const x of [EMB.nx-EMB.r-0.01,EMB.nx+EMB.r+0.01])for(const dz of [-1.0,1.0])box(0.42,EMB.ny+0.12,0.22,0x4a525c,x,0,ZU+dz,{m:.4}); // 베어링 받침
box(0.9,0.6,0.7,C.orange,EMB.nx-EMB.r,0,ZU-1.6);cyl(0.3,0.8,C.motor,EMB.nx-EMB.r,0.3,ZU-2.35,'z');
// 엠보 후 테이크오프 롤 + 경사 컨베이어 → 수세조
cyl(0.09,1.7,C.steel,82.5,0.14,ZU,'z',{m:.9});
// 엠보 후 경사 가이드롤 컨베이어 → 수세조
{const x1=82.45,y1=0.2,x2=78.9,y2=0.97,L=Math.hypot(x1-x2,y2-y1),ang=Math.atan2(y2-y1,x1-x2),n=Math.floor(L/0.28);
 const g=new THREE.CylinderGeometry(0.045,0.045,1.55,12);g.rotateX(Math.PI/2);const im=new THREE.InstancedMesh(g,M(C.roll,{m:.6,r:.35}),n);const mt=new THREE.Matrix4();
 for(let i=0;i<n;i++){const t=(i+.5)/n;mt.makeTranslation(x1+(x2-x1)*t,y1+(y2-y1)*t-0.06,ZU);im.setMatrixAt(i,mt);}im.castShadow=true;add(im);
 for(const dz of [-0.8,0.8]){const r=box(L,0.14,0.08,C.frame,(x1+x2)/2,(y1+y2)/2-0.17,ZU+dz);r.rotation.z=-ang;}
 for(const x of [79.5,80.7,81.9])for(const dz of [-0.8,0.8])box(0.08,y1+(x1-x)/(x1-x2)*(y2-y1)-0.2,0.08,C.frame,x,0,ZU+dz);}
end();

/* ===== 10. 수세조 ===== */
begin('wash');
tank(66.6,78.9,ZU,2.8,1.1,0x3fa7d6);   // 수세조 (가이드롤 구간까지 연장·확대)
for(const x of [68,70.5,73,75.5,78])cyl(0.08,2.8,C.steel,x,0.66,ZU,'z',{m:.8}); // 누름 가이드롤: 시트를 물속으로 눌러 통과
box(1.2,1.4,1.0,0x5e7d9a,72.7,0,ZU+2.3);
end();

/* ===== 11. 길로틴 ===== */
begin('cut');
conveyor(61.2,66.6,ZU,1.6,1.0);
for(const z of [ZU-1.25,ZU+1.25])box(1.4,3.2,0.35,C.red,64.7,0,z,{m:.3});
box(1.5,0.5,2.85,0x8e2b20,64.7,3.2,ZU);
const blade=box(0.35,0.5,2.2,0xb8c0c8,64.7,1.6,ZU,{m:.9,r:.2});
for(const dz of [-0.7,0.7])cyl(0.13,1.0,C.steel,64.7,3.9,ZU+dz,'y',{m:.8});
box(1.0,1.2,1.0,0x2f3b47,64.7,0,ZU+2.2);
end();

/* ===== 12. 수조 어닐링 (분배 → 열탕 → 중탕 → 냉탕 → U-TURN) ===== */
begin('anneal');
conveyor(52.6,61.2,ZU,1.6,1.0,{pitch:0.22});
tank(38.1,52.6,ZU,2.0,1.0,0xe4794a);   // 열탕
tank(30.1,38.1,ZU,2.0,1.0,0xd9b44a);   // 중탕
tank(19.0,30.1,ZU,2.0,1.0,0x3d8fd1);   // 냉탕
conveyor(16.25,19.0,ZU,1.6,1.0);
// heater boxes
for(const x of [41,45,49])box(0.9,1.2,0.8,0xa04020,x,0,ZU-1.6);
// U-turn (semicircle conveyor)
{const seg=18;for(let i=0;i<seg;i++){const t0=Math.PI*i/seg,t1=Math.PI*(i+1)/seg,tm=(t0+t1)/2;
  const x=UC.x-UC.r*Math.sin(tm),z=UC.z-UC.r*Math.cos(tm);
  const b=box(0.5,0.1,1.6,C.roll,x,0.88,z,{m:.5});b.rotation.y=tm;
  box(0.08,0.88,0.08,C.frame,UC.x-(UC.r+0.8)*Math.sin(tm),0,UC.z-(UC.r+0.8)*Math.cos(tm));
  box(0.08,0.88,0.08,C.frame,UC.x-(UC.r-0.8)*Math.sin(tm),0,UC.z-(UC.r-0.8)*Math.cos(tm));}}
conveyor(16.25,18.5,ZL,1.6,1.0);
end();

/* ===== 13. UV 코팅 ===== */
begin('uvc');
box(4.0,1.6,1.9,0xb0563a,20.5,0,ZL,{m:.3});        // 가열평활기 4m
box(4.0,0.15,1.6,C.dark,20.5,1.6,ZL);
for(const z of [ZL-1.0,ZL+1.0])box(1.8,2.2,0.3,0x2f6fae,23.7,0,z,{m:.35}); // 롤코팅기
cyl(0.2,1.5,0xd0d5da,23.5,1.25,ZL,'z',{m:.9});cyl(0.2,1.5,0x2a2f35,23.9,1.25,ZL,'z');cyl(0.15,1.5,0xd0d5da,23.7,1.62,ZL,'z',{m:.9});
box(1.0,0.4,1.0,0xe8e2c0,23.7,2.2,ZL);                  // 도료 팬
box(3.0,1.8,1.9,0xc9cfd5,26.3,0,ZL,{m:.4});         // 건조기 3m
cyl(0.25,1.2,0x9aa3ab,26.3,2.4,ZL,'y');
end();

/* ===== 14. UV 경화 ===== */
begin('uvx');
const uvGlow=[];
for(let i=0;i<7;i++){const x=28.5+i*1.35;
  box(1.15,1.0,1.9,0x3b3f58,x,1.15,ZL,{m:.3});
  const g=box(1.0,0.06,1.42,C.uv,x,1.08,ZL,{e:0x7c4dff,ei:1.6});uvGlow.push(g);
  box(0.6,0.5,0.6,0x2b2f3a,x,2.15,ZL);
}
conveyor(27.9,38.2,ZL,1.6,1.05);
cyl(0.3,6,0xbfc5cb,33,3.2,ZL,'x');                     // 배기 덕트
conveyor(38.2,45.4,ZL,1.6,1.0);                          // U.V 냉각
end();

/* ===== 15. 수조이송 ===== */
begin('wtr');
tank(45.4,59.0,ZL,2.0,0.95,0x5aa9e6);   // 수조이송 = 냉탕 (약 24℃)
conveyor(59.0,70.0,ZL,1.6,1.0);
end();

/* ===== 16. 톰슨프레스 ===== */
begin('press');
function press(x,z){
  box(3.2,0.55,3.0,0x3a3f45,x,0,z);
  for(const dx of [-1.25,1.25])for(const dz of [-1.1,1.1])cyl(0.16,3.2,C.steel,x+dx,2.2,z+dz,'y',{m:.85,r:.2});
  box(3.0,0.45,2.8,C.red,x,0.55,z,{m:.3});   // 하부 베드 (상면 FL+1.0 — 컨베이어와 동일 높이로 평평하게 투입)
  const plat=box(2.9,0.35,2.7,0x9aa3ab,x,2.2,z,{m:.7});
  box(3.3,0.8,3.1,C.red,x,3.8,z,{m:.3});
  cyl(0.38,1.0,C.steel,x,5.1,z,'y',{m:.8});
  box(1.4,1.6,1.0,0x2f3b47,x+2.4,0,z+1.4);
  return plat;
}
const presses=[press(65.1,27.8),press(74.3,24.2)];
// feeding conveyors
conveyor(61.6,63.4,27.8,1.4,0.95);
conveyor(70.0,72.6,24.2,1.4,0.95);
// 분배 이송 — 하부 가이드롤 컨베이어 (Z방향)
function conveyorZ(z1,z2,x,w=1.4,h=0.95){const L=Math.abs(z2-z1),cz=(z1+z2)/2,z0=Math.min(z1,z2);
  box(0.1,0.14,L,C.frame,x-w/2,h-0.14,cz);box(0.1,0.14,L,C.frame,x+w/2,h-0.14,cz);
  const n=Math.max(2,Math.floor(L/0.3));const g=new THREE.CylinderGeometry(0.045,0.045,w-0.05,12);g.rotateZ(Math.PI/2);
  const im=new THREE.InstancedMesh(g,M(C.roll,{m:.6,r:.35}),n);const mt=new THREE.Matrix4();
  for(let i=0;i<n;i++){mt.makeTranslation(x,h-0.05,z0+L*(i+.5)/n);im.setMatrixAt(i,mt);}im.castShadow=true;add(im);
  // 하부 가이드롤 (측면 안내)
  for(let i=0;i<=Math.floor(L/0.6);i++)for(const dx of [-w/2+0.08,w/2-0.08])cyl(0.035,0.12,0x2f3b47,x+dx,h+0.04,z0+i*0.6,'y',{m:.4});
  const ls=Math.max(2,Math.ceil(L/2.0));for(let i=0;i<=ls;i++){const z=z0+L*i/ls;box(0.08,h-0.14,0.08,C.frame,x-w/2,0,z);box(0.08,h-0.14,0.08,C.frame,x+w/2,0,z);}}
conveyorZ(ZL+0.8,27.8+0.7,61.6);
conveyorZ(ZL+0.8,24.2+0.7,70.0);
end();

/* ===== 17~20. 박스 포장 → 지게차 → 자동 래핑 → 팔레트 적재 =====
   기준: 일신케미칼 IN LINE 2호기 LAY-OUT — PRESS → CONVEYOR SYSTEM → 포장기 → LABELLER → TURN/ROLLER CONVEYOR → 포장 적재용 스테이션 (2열) */
const LANES=[{z:27.8,cx0:66.8,dx:0},{z:24.2,cx0:76.0,dx:9.2}]; // 상부열(프레스2)도 하부열과 동일 거리(프레스→포장기 약 19.3m)
const PKX0=84.4,PKX1=87.0,LBX1=90.2,PAL_X=93.0;
const IX0=78.2,IX1=82.6; // 육안 검사대 구간
const palW=new THREE.MeshStandardMaterial({color:0x9c7a4a,roughness:.9});
const cartM=new THREE.MeshStandardMaterial({color:0xc49a62,roughness:.85});
const filmM=new THREE.MeshStandardMaterial({color:0xe8f2ff,roughness:.2,metalness:0,transparent:true,opacity:.45,depthWrite:false});
const palGeo=new THREE.BoxGeometry(1.1,0.14,1.1),cartGeo=new THREE.BoxGeometry(0.53,0.29,0.35),filmGeo=new THREE.BoxGeometry(1.16,1.24,1.16);
const NBOX=24;
function makePallet(fill=0,wrapped=false){const g=new THREE.Group();const b=new THREE.Mesh(palGeo,palW);b.position.y=0.07;b.castShadow=true;g.add(b);g.userData.boxes=[];
  for(let k=0;k<NBOX;k++){const L=Math.floor(k/6),r=k%6;const m=new THREE.Mesh(cartGeo,cartM);m.position.set(-0.27+(r%2)*0.54,0.14+0.145+L*0.3,-0.36+Math.floor(r/2)*0.36);m.castShadow=true;m.visible=k<fill;g.add(m);g.userData.boxes.push(m);}
  const f=new THREE.Mesh(filmGeo,filmM);f.position.y=0.76;f.visible=wrapped;g.add(f);g.userData.film=f;g.userData.fill=fill;return g;}
function setFill(p,n){p.userData.fill=n;p.userData.boxes.forEach((m,k)=>m.visible=k<n);}

/* ===== 17. 육안 검사 (톰슨프레스 → 박스포장 사이) =====
   검사대 높이 = 프레스 베드 높이(FL+1.0) · 상부 형광등으로 조도 확보 · 양쪽에서 여성 검사원 육안 검사 */
begin('insp');
function inspector(x,z,face,top=0xf5b7c5){
  box(0.15,0.8,0.15,0x34495e,x-0.09,0,z);box(0.15,0.8,0.15,0x34495e,x+0.09,0,z);
  const sk=new THREE.Mesh(new THREE.CylinderGeometry(0.2,0.3,0.45,14),M(0xf4f6f8,{m:0,r:.8}));sk.position.set(x,0.95,z);add(sk); // 위생 가운
  box(0.42,0.62,0.26,top,x,1.0,z,{m:0,r:.8});
  const h=new THREE.Mesh(new THREE.SphereGeometry(0.125,14,10),M(0xe8c0a0,{m:0,r:.9}));h.position.set(x,1.78,z);add(h);
  const cap=new THREE.Mesh(new THREE.SphereGeometry(0.14,14,8,0,Math.PI*2,0,Math.PI/1.8),M(0xffffff,{m:0,r:.6}));cap.position.set(x,1.8,z);add(cap); // 위생모
  const hair=new THREE.Mesh(new THREE.SphereGeometry(0.1,10,8),M(0x2b1d14,{m:0,r:.9}));hair.position.set(x,1.72,z-face*0.12);add(hair);
  // 팔 (검사대 쪽으로)
  for(const dx of [-0.17,0.17]){const a=box(0.08,0.08,0.42,0xf5b7c5,x+dx,1.25,z+face*0.2);a.rotation.x=face*0.5;}
}
const inspLights=[];
for(const [li,L] of LANES.entries()){
  // 검사대 양측 작업면 (컨베이어 높이)
  for(const dz of [-0.95,0.95])box((IX1+L.dx)-(IX0+L.dx),0.06,0.5,0xd5dbe1,((IX0+L.dx)+(IX1+L.dx))/2,0.94,L.z+dz,{m:.5});
  // 형광등 프레임 + 등기구
  for(const x of [(IX0+L.dx),(IX1+L.dx)])for(const dz of [-1.25,1.25])box(0.07,2.35,0.07,0x95a5a6,x,0,L.z+dz);
  for(const dz of [-1.25,1.25])box((IX1+L.dx)-(IX0+L.dx),0.06,0.06,0x95a5a6,((IX0+L.dx)+(IX1+L.dx))/2,2.32,L.z+dz);
  for(const dz of [-0.35,0.35]){box((IX1+L.dx)-(IX0+L.dx)-0.2,0.08,0.22,0xecf0f1,((IX0+L.dx)+(IX1+L.dx))/2,2.2,L.z+dz,{m:.3});
    for(const tz of [-0.05,0.05]){const t=cyl(0.022,(IX1+L.dx)-(IX0+L.dx)-0.4,0xffffff,((IX0+L.dx)+(IX1+L.dx))/2,2.17,L.z+dz+tz,'x',{e:0xf4fbff,ei:2.2,m:0});inspLights.push(t);}
    box(0.1,0.32,0.04,0x95a5a6,((IX0+L.dx)+(IX1+L.dx))/2,2.26,L.z+dz);}
  const pl=new THREE.PointLight(0xf2f8ff,6,5,1.6);pl.position.set(((IX0+L.dx)+(IX1+L.dx))/2,2.0,L.z);G.add(pl);
  // 여성 검사원 — 검사대 양쪽
  { const x=((IX0+L.dx)+(IX1+L.dx))/2; inspector(x,L.z-1.45,1); inspector(x,L.z+1.45,-1,0xc39bd3); } // 검사원 2명: 컨베이어 사이에 두고 마주보기
}
end();

begin('box');
const palSt=[],stacks=[];
for(const [li,L] of LANES.entries()){
  conveyor(L.cx0,(PKX0+L.dx),L.z,1.4,1.0,{pitch:0.4});                               // CONVEYOR SYSTEM (프레스 베드와 동일 높이)
  box((PKX1+L.dx)-(PKX0+L.dx),2.1,2.2,0xdfe3e8,((PKX0+L.dx)+(PKX1+L.dx))/2,0,L.z,{m:.3});                 // 포장기 (자동 박스 포장)
  box(0.9,1.3,1.6,C.red,(PKX0+L.dx)+0.5,0.9,L.z,{m:.3});                             // 박스 성형부
  // 낱장 적층기 (포장기 앞) — 재단 낱장을 일정 매수로 쌓음
  for(const dx of [-0.7,0.7])for(const dz of [-0.7,0.7])box(0.08,1.6,0.08,C.frame,(PKX0+L.dx)-1.0+dx,0,L.z+dz);
  box(1.5,0.08,1.5,C.frame,(PKX0+L.dx)-1.0,1.6,L.z);
  const stk=box(1.0,0.01,1.1,0x9c7a52,(PKX0+L.dx)-1.0,1.02,L.z,{m:0});stk.userData.base=1.02;stacks.push(stk);
  // 핫멜트 유닛 (박스 접착)
  box(0.7,1.1,0.6,0xe67e22,((PKX0+L.dx)+(PKX1+L.dx))/2,0,L.z+(li?-1.5:1.5),{m:.3});
  pipe([[((PKX0+L.dx)+(PKX1+L.dx))/2,1.1,L.z+(li?-1.5:1.5)],[((PKX0+L.dx)+(PKX1+L.dx))/2,1.9,L.z+(li?-1.3:1.3)],[((PKX0+L.dx)+(PKX1+L.dx))/2+0.3,1.6,L.z+(li?-1.05:1.05)]],0.04,0x2c3e50);
  box(0.5,0.5,0.4,0x2f3b47,(PKX1+L.dx)-0.3,2.1,L.z-1.0);
  conveyor((PKX1+L.dx),(LBX1+L.dx),L.z,0.9,0.9,{pitch:0.25});                               // LABELLER
  box(0.6,1.5,0.5,0x34495e,(PKX1+L.dx)+1.4,0,L.z+(li?-0.9:0.9));
  box(0.5,0.35,0.35,C.green,(PKX1+L.dx)+1.4,1.5,L.z+(li?-0.6:0.6));
  conveyor((LBX1+L.dx),(PAL_X+L.dx)-0.7,L.z,0.9,0.9,{pitch:0.25});                          // TURN / ROLLER CONVEYOR
  // 포장 적재 스테이션 (갠트리 + 롤러 위 팔레트)
  conveyor((PAL_X+L.dx)-0.7,(PAL_X+L.dx)+0.7,L.z,1.3,0.2,{pitch:0.18});
  for(const dx of [-0.95,0.95])for(const dz of [-0.95,0.95])box(0.12,2.7,0.12,C.yellow,(PAL_X+L.dx)+dx,0,L.z+dz);
  box(2.0,0.15,0.15,C.yellow,(PAL_X+L.dx),2.7,L.z-0.95);box(2.0,0.15,0.15,C.yellow,(PAL_X+L.dx),2.7,L.z+0.95);
  const head=box(0.4,0.4,1.8,0x2f3b47,(PAL_X+L.dx),2.3,L.z);
  const p=makePallet(0);p.position.set((PAL_X+L.dx),0.2,L.z);scene.add(p);
  palSt.push({L,pal:p,head,t:0});
}
end();

// 자동 래핑기 (턴테이블 + 마스트)
begin('wrap');
const WR={x:112.0,z:30.5};   // 자동 래핑기 — 포장열과 충분히 이격
cyl(1.15,0.12,0x3a3f45,WR.x,0.06,WR.z,'y',{seg:36});
const turn=cyl(1.0,0.06,0x8a96a3,WR.x,0.15,WR.z,'y',{seg:36,m:.6});
box(0.35,3.0,0.35,0x2e86c1,WR.x+1.55,0,WR.z,{m:.3});
const carriage=box(0.5,0.5,0.6,0x2f3b47,WR.x+1.3,0.2,WR.z);
const filmRoll=cyl(0.12,0.5,0xf4f8ff,WR.x+1.05,0.45,WR.z,'y',{m:0,r:.2});
box(0.8,1.4,0.6,0x34495e,WR.x+1.6,0,WR.z+1.4);
for(const [a,b] of [[[WR.x-1.6,WR.z-1.7],[WR.x+2.2,WR.z-1.7]],[[WR.x-1.6,WR.z+1.7],[WR.x+0.9,WR.z+1.7]]])rail([a,b],0,0.9);
end();

// 팔레트 적재장 (래핑 완료 팔레트 2단 적재)
begin('store');
// 완제품 팔레트 적재장 (기존 대비 4배) — 중앙 통로 Z=27.3 양측 적재, 바깥 열은 장기 적치
const ST_X=[117.0,118.5,120.0,121.5,123.0,124.5,126.0,127.5],AISLE=27.3;
const SLOTS=[];for(const z of [25.2,29.4])for(const x of ST_X)for(const lv of [0,1])SLOTS.push({x,z,lv});
const yLv=lv=>lv?1.38:0;
box(12.2,0.02,10.2,0xf1c40f,122.25,0,27.3,{t:.22,cs:false});                   // 바닥 적재 구획
box(12.2,0.025,1.2,0x7f8c8d,122.25,0,AISLE,{t:.35,cs:false});                    // 지게차 통로
for(const z of [23.2,31.4])for(const x of ST_X)for(const lv of [0,1]){const p=makePallet(NBOX,true);p.position.set(x,yLv(lv),z);scene.add(p);}
const stored=[];
const PRE=12;function prefill(){for(let k=0;k<PRE;k++){const s=SLOTS[k];const p=makePallet(NBOX,true);p.position.set(s.x,yLv(s.lv),s.z);scene.add(p);stored.push(p);}}prefill();
let slotI=PRE;
end();

// 지게차
const fork=new THREE.Group();scene.add(fork);GROUPS.fork=fork;
{const pre=G;G=fork;
 box(1.6,0.75,1.1,0xe67e22,-0.15,0.25,0,{m:.3});         // body
 box(0.5,0.75,1.1,0x2c3e50,-0.85,0.35,0);                  // counterweight
 box(0.6,0.5,0.9,0x2c3e50,-0.2,1.0,0);                     // seat/hood
 for(const dx of [-0.7,0.45])for(const dz of [-0.5,0.5])box(0.06,1.3,0.06,0x2c3e50,dx,1.0,dz);
 box(1.25,0.06,1.1,0x2c3e50,-0.12,2.3,0);                  // overhead guard
 for(const [dx,dz,r] of [[0.45,-0.55,0.27],[0.45,0.55,0.27],[-0.7,-0.55,0.22],[-0.7,0.55,0.22]])cyl(r,0.22,0x1b1f23,dx,r,dz,'z',{r:.9,m:0});
 box(0.1,2.6,0.9,0x34495e,0.72,0,0);                       // mast
 G=pre;}
const carr=new THREE.Group();fork.add(carr);
{const pre=G;G=carr;box(0.1,0.7,0.95,0x2c3e50,0.8,0,0);for(const dz of [-0.3,0.3])box(1.15,0.05,0.12,0x5d6d7e,1.4,0,dz);G=pre;}
const FK={x:100.0,z:AISLE,h:Math.PI,lift:0.08,load:null,q:[],src:0,srcCnt:0};
fork.position.set(FK.x,0,FK.z);
let wrapState={pal:null,t:0,on:false};
function plan(){const st=palSt[FK.src];FK.src^=1;const z=st.L.z,sx=PAL_X+st.L.dx+1.4;
  const s=SLOTS[slotI%SLOTS.length];
  FK.q=[
   {to:[PAL_X+st.L.dx+2.8,z]},{face:Math.PI},{lift:0.16},{to:[sx,z]},{waitFull:st},{pick:st},{lift:0.3},{to:[PAL_X+st.L.dx+2.8,z],rev:1},
   {to:[WR.x-3.6,WR.z]},{face:0},{to:[WR.x-1.4,WR.z]},{lift:0.16},{dropWrap:1},{lift:0.08},{to:[WR.x-3.6,WR.z],rev:1},
   {waitWrap:1},{lift:0.14},{to:[WR.x-1.4,WR.z]},{pickWrap:1},{lift:0.3},{to:[WR.x-3.6,WR.z],rev:1},
   {to:[WR.x-3.6,AISLE]},{to:[s.x,AISLE]},{face:s.z<AISLE?-Math.PI/2:Math.PI/2},{lift:yLv(s.lv)+0.12},{to:[s.x,s.z+(s.z<AISLE?1.4:-1.4)]},{dropSlot:s},{lift:yLv(s.lv)+0.02},{to:[s.x,AISLE],rev:1},{lift:0.08},{to:[WR.x-3.6,AISLE]}
  ];}
function angTo(a,b,step){let d=((b-a+Math.PI*3)%(Math.PI*2))-Math.PI;return Math.abs(d)<=step?b:a+Math.sign(d)*step;}
function packUpdate(dt){
  // 포장 스테이션: 박스 적재
  for(const st of palSt){const p=st.pal;if(p.userData.fill<NBOX){st.t+=dt;if(st.t>1.1){st.t=0;setFill(p,p.userData.fill+1);}}
    st.head.position.y=2.3+0.15*Math.sin(performance.now()/300);}
  for(const sk of stacks){const n=(T*1.5)%12;sk.scale.y=Math.max(1,n*3);sk.position.y=sk.userData.base+n*0.015;}
  // 래핑
  if(wrapState.pal){turn.rotation.y+=dt*2.2;wrapState.pal.rotation.y+=dt*2.2;
    if(wrapState.on){wrapState.t+=dt;const k=(wrapState.t%3)/3;carriage.position.y=0.45+1.0*(k<.5?k*2:2-k*2);filmRoll.position.y=carriage.position.y+0.25;
      if(wrapState.t>6){wrapState.on=false;wrapState.pal.userData.film.visible=true;wrapState.pal.rotation.y=0;}}}
  if(!FK.q.length)plan();
  const a=FK.q[0];const sp=2.2*dt;
  if(a.to){const dx=a.to[0]-FK.x,dz=a.to[1]-FK.z,d=Math.hypot(dx,dz);
    if(d<0.02){FK.q.shift();}else{let want=Math.atan2(dz,dx);if(a.rev)want+=Math.PI;const nh=angTo(FK.h,want,dt*2.5);const ok=Math.abs(((nh-want+Math.PI*3)%(Math.PI*2))-Math.PI)<0.15;FK.h=nh;
      if(ok){const s=Math.min(sp,d);FK.x+=dx/d*s;FK.z+=dz/d*s;}}}
  else if(a.face!==undefined){FK.h=angTo(FK.h,a.face,dt*2.0);if(Math.abs(FK.h-a.face)<1e-3||Math.abs(((FK.h-a.face+Math.PI*3)%(Math.PI*2))-Math.PI)<1e-3)FK.q.shift();}
  else if(a.lift!==undefined){const d=a.lift-FK.lift;if(Math.abs(d)<0.01){FK.lift=a.lift;FK.q.shift();}else FK.lift+=Math.sign(d)*Math.min(Math.abs(d),dt*0.8);}
  else if(a.waitFull){if(a.waitFull.pal.userData.fill>=NBOX)FK.q.shift();}
  else if(a.pick){const st=a.pick;FK.load=st.pal;scene.remove(st.pal);carr.add(st.pal);st.pal.position.set(1.4,0.04,0);st.pal.rotation.set(0,0,0);
    const np=makePallet(0);np.position.set(PAL_X+st.L.dx,0.2,st.L.z);scene.add(np);st.pal=np;st.t=0;FK.q.shift();}
  else if(a.dropWrap){const p=FK.load;carr.remove(p);scene.add(p);p.position.set(WR.x,0.18,WR.z);p.rotation.set(0,0,0);FK.load=null;wrapState={pal:p,t:0,on:true};FK.q.shift();}
  else if(a.waitWrap){if(!wrapState.on)FK.q.shift();}
  else if(a.pickWrap){const p=wrapState.pal;scene.remove(p);carr.add(p);p.position.set(1.4,0.04,0);p.rotation.set(0,0,0);FK.load=p;wrapState={pal:null,t:0,on:false};carriage.position.y=0.45;FK.q.shift();}
  else if(a.dropSlot){const s=a.dropSlot,p=FK.load;carr.remove(p);scene.add(p);p.position.set(s.x,yLv(s.lv),s.z);p.rotation.set(0,0,0);FK.load=null;stored.push(p);slotI++;
    if(slotI>=SLOTS.length){for(const q of stored)scene.remove(q);stored.length=0;prefill();slotI=PRE;}FK.q.shift();}
  fork.position.set(FK.x,0,FK.z);fork.rotation.y=-FK.h;carr.position.y=FK.lift;
  // 포장 라인 흐름: 원장(프레스→포장기), 박스(포장기→적재 스테이션)
  let k=0,c=0;for(const [li,L] of LANES.entries()){const arr=lanePieces[li],end=PKX0+L.dx-0.5;for(let j=arr.length-1;j>=0;j--){arr[j]+=dt*LANE_V;if(arr[j]>end)arr.splice(j,1);}
      for(const x of arr)for(const [ox,oz] of TILE_OFF){if(k>=TILE_CAP)break;dummy.position.set(x+ox,1.03,L.z+oz);dummy.rotation.set(0,0,0);dummy.updateMatrix();laneSheet.setMatrixAt(k++,dummy.matrix);}
    const l2=(PAL_X-0.8)-PKX1;for(let i=0;i<6;i++){const x=PKX1+L.dx+((T*0.9+i*l2/6)%l2);dummy.position.set(x,1.05,L.z);dummy.updateMatrix();laneCart.setMatrixAt(c++,dummy.matrix);}}
  laneSheet.count=k;laneSheet.instanceMatrix.needsUpdate=true;laneCart.instanceMatrix.needsUpdate=true;
}
// 톰슨프레스 1타 = 원장 1장 → 작은 제품 4매(2×2)로 재단되어 배출
const TILE_OFF=[[-0.27,-0.29],[0.27,-0.29],[-0.27,0.29],[0.27,0.29]],TILE_CAP=160,LANE_V=0.5;
const lanePieces=[[],[]];
const laneSheet=new THREE.InstancedMesh(new THREE.BoxGeometry(0.5,0.03,0.54),new THREE.MeshStandardMaterial({map:scrollTex(woodDraw,256,256),roughness:.6}),TILE_CAP);laneSheet.castShadow=true;laneSheet.frustumCulled=false;scene.add(laneSheet);
const laneCart=new THREE.InstancedMesh(cartGeo,cartM,12);laneCart.castShadow=true;laneCart.frustumCulled=false;scene.add(laneCart);

/* ---------- flow animation ---------- */
function polyPath(pts){const v=pts.map(p=>new THREE.Vector3(...p));const L=[0];for(let i=1;i<v.length;i++)L.push(L[i-1]+v[i].distanceTo(v[i-1]));return {v,L,total:L[L.length-1],at(d){d=((d%this.total)+this.total)%this.total;let i=1;while(i<this.L.length-1&&this.L[i]<d)i++;const t=(d-this.L[i-1])/(this.L[i]-this.L[i-1]||1);return new THREE.Vector3().lerpVectors(this.v[i-1],this.v[i],t);},dir(d){const a=this.at(d),b=this.at(d+0.05);return b.sub(a).normalize();}};}
// 원료 (silo → 2층 → 슈퍼믹서 → 반바리 → 압출 → 스윙 → 캘린더)
// ① 고운 수지류 공압 이송·자동계량 (PVC / CaCO3) → 슈퍼믹서 → 반바리 입구
const P_PVC=polyPath([[145,19.6,14.5],[145,20,14.5],[140,20,13.8],[132,8.2,12.6],[129.6,7.8,12.4],[129,7.7,12.2],[129,6.1,12.2]]);
const P_CC =polyPath([[149.3,19.6,14.9],[149.3,20.5,14.9],[140,20.5,14.3],[132,8.6,13.6],[129.6,8.0,13.8],[129,7.7,14.2],[129,6.1,14.2]]);
const P_W1=polyPath([[129,6.1,12.2],[127.8,6.9,13.0],[124.2,7.6,13.6],[123.75,7.3,13.6]]);
const P_W2=polyPath([[129,6.1,14.2],[128.0,7.0,13.9],[127.6,7.6,13.6],[127.25,7.3,13.6]]);
const P_M1=polyPath([[123.75,6.4,13.6],[123.75,5.8,14.3],[123.75,DK+5.4,15.2],[123.75,DK+3.7,15.5]]);
const P_M2=polyPath([[127.25,6.4,13.6],[127.25,5.8,14.3],[127.25,DK+5.4,15.2],[127.25,DK+3.7,15.5]]);
// ② 액상가소제(DOTP)
const P_LQ=polyPath([[134.0,0.3,20.4],[133.3,0.25,20.2],[132.6,0.3,20.0],[131.5,0.6,19.6],[131.3,6.6,17.4],[129.2,7.1,16.6],[128.7,6.9,16.4]]);
const P_L1=polyPath([[128.6,6.6,16.4],[128.0,8.3,15.6],[124.15,8.3,14.2],[124.15,7.95,13.8]]);
const P_L2=polyPath([[128.6,6.6,16.4],[128.0,8.3,15.6],[127.65,8.3,14.2],[127.65,7.95,13.8]]);
const FLOWS=[[P_W1,10,1.2,0xf4f1ea,0.05],[P_W2,10,1.2,0xf4f1ea,0.05],[P_M1,10,1.0,0xeee8d8,0.06],[P_M2,10,1.0,0xeee8d8,0.06],[P_L1,16,1.5,0xe0b52e,0.04],[P_L2,16,1.5,0xe0b52e,0.04]];
const rawN=FLOWS.reduce((a,f)=>a+f[1],0);
const rawM=new THREE.InstancedMesh(new THREE.SphereGeometry(1,8,6),new THREE.MeshStandardMaterial({roughness:.6}),rawN);rawM.frustumCulled=false;scene.add(rawM);
{let k=0;const c=new THREE.Color();for(const f of FLOWS)for(let i=0;i<f[1];i++)rawM.setColorAt(k++,c.setHex(f[3]));rawM.instanceColor.needsUpdate=true;}
// ③ 반바리 배출 덩어리 (150L ≈ 260kg) — 3분 주기, 2대 교대 → 압출기 호퍼
const lumpGeo=new THREE.DodecahedronGeometry(0.42,1);
const lumps=[123.75,127.25].map((bx,i)=>{const m=new THREE.Mesh(lumpGeo,new THREE.MeshStandardMaterial({color:0xa8a48e,roughness:.85}));m.scale.set(1.25,0.75,1.0);m.castShadow=true;scene.add(m);
  return {m,bx,path:polyPath([[bx,0.85,15.4],[bx,0.55,15.4],[123.0,0.55,15.4],[117.9,2.9,15.4],[117.5,2.5,15.3],[117.5,1.8,15.3]]),ph:i*0.5};});
const steamN=60,steam=new THREE.InstancedMesh(new THREE.SphereGeometry(1,8,6),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0.18,depthWrite:false}),steamN);steam.frustumCulled=false;scene.add(steam);
const steamSeed=[...Array(steamN)].map(()=>[38.4+Math.random()*13.9,(Math.random()-0.5)*1.6,Math.random()]);
const LUMP_CYCLE=20; // 화면 가속: 실제 3분 주기 (2대 교대 → 압출기 1.5분마다 1회 투입)
// 시트 (캘린더 → 합지 → 엠보 → 수세조 → 길로틴) : 연속 시트
const LAMI4=96.15; // 라미4 위치 — 이후 나무무늬
function scrollTex(draw,w,h){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.colorSpace=THREE.SRGBColorSpace;return t;}
function woodDraw(x,w,h){x.fillStyle='#9a7046';x.fillRect(0,0,w,h);for(let i=0;i<70;i++){const y0=Math.random()*h;x.strokeStyle=`rgba(${70+Math.random()*40|0},${45+Math.random()*25|0},${25+Math.random()*15|0},${0.25+Math.random()*0.35})`;x.lineWidth=0.6+Math.random()*1.8;x.beginPath();for(let k=0;k<=w;k+=8){const y=y0+Math.sin(k/w*Math.PI*2*(1+i%3)+i)*3+Math.sin(k/37+i)*1.2;k?x.lineTo(k,y):x.moveTo(k,y);}x.stroke();}
  for(let i=0;i<4;i++){x.fillStyle='rgba(60,35,18,0.25)';const cx=Math.random()*w,cy=Math.random()*h;x.beginPath();x.ellipse(cx,cy,10,3,0,0,Math.PI*2);x.fill();}}
const sheetTex=scrollTex(woodDraw,512,64);sheetTex.repeat.set((LAMI4-63)/1.8,1);
const grayTex=scrollTex((x,w,h)=>{x.fillStyle='#3d4045';x.fillRect(0,0,w,h);for(let i=0;i<w;i+=32){x.fillStyle='#45484e';x.fillRect(i,0,14,h);}},256,16);grayTex.repeat.set((111-LAMI4)/1.6,1);
const woodSheetM=new THREE.MeshStandardMaterial({map:sheetTex,roughness:.6}),graySheetM=new THREE.MeshStandardMaterial({map:grayTex,roughness:.7});
sheetTex.repeat.set(1,1);grayTex.repeat.set(1,1);
function sheetPiece(a,b,mat,per){const dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy);const g=new THREE.BoxGeometry(L,0.03,1.25);const uv=g.attributes.uv;for(let i=0;i<uv.count;i++)uv.setX(i,uv.getX(i)*L/per);
  const m=new THREE.Mesh(g,mat);m.position.set((a[0]+b[0])/2,(a[1]+b[1])/2,ZU);m.rotation.z=Math.atan2(dy,dx);scene.add(m);return m;}
sheetPiece([LAMI4,1.06],[111,1.06],graySheetM,1.6);
const nx=EMB.nx;
for(const [a,b] of [[[nx+0.1,1.06],[LAMI4,1.06]],[[nx,0.98],[nx+0.1,1.06]],[[nx,0.5],[nx,0.98]],[[82.55,0.22],[nx,0.5]],[[79.3,1.05],[82.55,0.22]],[[78.6,0.55],[79.3,1.05]],[[67.0,0.55],[78.6,0.55]],[[66.3,1.06],[67.0,0.55]],[[63,1.06],[66.3,1.06]]])sheetPiece(a,b,woodSheetM,1.8);
// 원장 (길로틴 이후 → 어닐링 → U-TURN → UV → 수조이송 → 프레스)
const uturn=[];for(let i=0;i<=16;i++){const t=Math.PI*i/16;uturn.push([UC.x-UC.r*Math.sin(t),1.06,UC.z-UC.r*Math.cos(t)]);}
const pathA=polyPath([[64.2,1.06,ZU],[52.6,1.06,ZU],[52.0,0.75,ZU],[19.5,0.75,ZU],[19.0,1.06,ZU],...uturn,[27.9,1.06,ZL],[28.0,1.12,ZL],[38.2,1.12,ZL],[45.4,1.06,ZL],[45.8,0.72,ZL],[58.6,0.72,ZL],[59.0,1.06,ZL],[61.6,1.03,ZL],[61.6,1.03,27.8],[65.1,1.03,27.8]]);
const pathB=polyPath([[64.2,1.06,ZU],[52.6,1.06,ZU],[52.0,0.75,ZU],[19.5,0.75,ZU],[19.0,1.06,ZU],...uturn,[27.9,1.06,ZL],[28.0,1.12,ZL],[38.2,1.12,ZL],[45.4,1.06,ZL],[45.8,0.72,ZL],[58.6,0.72,ZL],[59.0,1.06,ZL],[70.0,1.03,ZL],[70.0,1.03,24.2],[74.3,1.03,24.2]]);
// 원장 이송: 프레스 1·2로 교대 공급, 프레스 아래에서 정지(드웰) → 1장당 1타 → 재단품 배출
const PV=1.2,PSN=4.0;                                   // 이송 속도(m/s, 화면용) · 같은 프레스로 가는 원장 간격
const PTOT=Math.max(pathA.total,pathB.total)+PSN*0.45;
const PN=Math.round(PTOT/PSN),PSP=PTOT/PN;
const FEEDS=[{P:pathA,off:0,lane:0,prev:[]},{P:pathB,off:PSP/2,lane:1,prev:[]}];
const panelN=PN;
const panM=new THREE.InstancedMesh(new THREE.BoxGeometry(1.15,0.04,1.25),new THREE.MeshStandardMaterial({map:scrollTex(woodDraw,256,256),roughness:.6}),panelN*2);panM.castShadow=true;panM.frustumCulled=false;scene.add(panM);
let flowOn=true;const dummy=new THREE.Object3D();
root.remove(GROUPS.silo); // 원료 사일로는 공장 외부 기존 사일로 3기 사용
root.traverse(o=>{ if(o.isMesh){ o.castShadow=false; } });
function update(dt){ if(flowOn)T+=dt;
  // swing conveyor
  swingPivot.rotation.y=Math.sin(T*1.6)*0.28;
  // rolls spin
  for(const r of calRolls)r.rotation.y+=dt*2.2; for(const r of lamiRolls)r.rotation.y+=dt*1.5; for(const r of emboRolls)r.rotation.y+=dt*2;
  // guillotine blade
  const g=0.5+0.5*Math.sin(T*6);for(const u of uvGlow)u.material.emissiveIntensity=1.2+g*0.8;
  sheetTex.offset.x=(sheetTex.offset.x+dt*PV/1.8)%1;grayTex.offset.x=(grayTex.offset.x+dt*PV/1.6)%1;irPanel.material.emissiveIntensity=1.6+0.25*Math.sin(T*3);for(const hp of heaterPlates)hp.material.emissiveIntensity=1.2+0.2*Math.sin(T*3+hp.position.x);
  if(flowOn){
    {let k=0;for(const [P,n,v,c,r] of FLOWS)for(let i=0;i<n;i++){const p=P.at(T*v+i*P.total/n);dummy.position.copy(p);dummy.rotation.set(0,0,0);dummy.scale.setScalar(r);dummy.updateMatrix();rawM.setMatrixAt(k++,dummy.matrix);}dummy.scale.setScalar(1);rawM.instanceMatrix.needsUpdate=true;}
    for(const L of lumps){const ph=((T/LUMP_CYCLE+L.ph)%1);const tt=ph*LUMP_CYCLE;const dur=8;
      if(tt<dur){L.m.visible=true;const d=Math.min(L.path.total-0.01,(tt/dur)*L.path.total);L.m.position.copy(L.path.at(d));L.m.rotation.y=tt*0.2;}else L.m.visible=false;}
    for(let i=0;i<steamN;i++){const [x,dz,ph]=steamSeed[i];const k=(T*0.25+ph)%1;dummy.position.set(x,1.0+k*1.6,ZU+dz);dummy.rotation.set(0,0,0);dummy.scale.setScalar(0.12+k*0.25);dummy.updateMatrix();steam.setMatrixAt(i,dummy.matrix);}dummy.scale.setScalar(1);steam.instanceMatrix.needsUpdate=true;
    stripTex.offset.x=(stripTex.offset.x-dt*0.8)%1; calBank.rotation.y+=dt*3;
    let k=0;for(const f of FEEDS){const P=f.P,D=PTOT-P.total;let stroke=0;
      for(let i=0;i<PN;i++){const u=(T*PV+i*PSP+f.off)%PTOT;
        let p,dir;if(u<=P.total)f.prev[i]=0;
        if(u<=P.total){p=P.at(u);dir=P.dir(Math.min(u,P.total-0.06));}
        else{const q=(u-P.total)/D;p=P.at(P.total-0.001);dir=P.dir(P.total-0.06);const t=Math.min(1,Math.max(0,(q-0.15)/0.6));stroke=Math.max(stroke,Math.sin(Math.PI*t));
          if(q>0.5){if(!f.prev[i]){f.prev[i]=1;lanePieces[f.lane].push(LANES[f.lane].cx0-1.7);}   // 1타 완료 → 재단품 4매 배출
            dummy.position.set(0,-50,0);dummy.updateMatrix();panM.setMatrixAt(k++,dummy.matrix);continue;}} // 타발 후 원장 → 재단품으로 전환
        dummy.position.copy(p);dummy.rotation.set(0,-Math.atan2(dir.z,dir.x),0);dummy.updateMatrix();panM.setMatrixAt(k++,dummy.matrix);}
      presses[f.lane].position.y=2.4-stroke*1.2;}
    {const ph=((T*PV)%(PSP/2))/(PSP/2);blade.position.y=2.6-Math.max(0,Math.sin(Math.PI*Math.min(1,ph/0.25)))*1.25*(ph<0.25?1:0);}
    panM.instanceMatrix.needsUpdate=true;
    packUpdate(dt);
  }
}
function setFlow(on){flowOn=on;rawM.visible=panM.visible=laneSheet.visible=laneCart.visible=steam.visible=on;lumps.forEach(l=>l.m.visible=on);}
return {GROUPS,update,setFlow,ZU,ZL,PIT,LEL,EL2,DK};
}
