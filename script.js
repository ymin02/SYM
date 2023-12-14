const { Engine, Render, Runner, Bodies, World, MouseConstraint, Mouse, Vertices, Events } = Matter;

const engine = Engine.create();
const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
    },
});

const runner = Runner.create();
Runner.run(runner, engine);
Render.run(render);

const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        render: { visible: false },
    },
});

World.add(engine.world, mouseConstraint);

// 사용자 지정 다각형 벽의 꼭짓점 정보를 입력합니다.
const customWallVertices = Vertices.create([
    { x: 100, y: 100 },
    { x: 200, y: 100 },
    { x: 200, y: 200 },
    { x: 100, y: 200 },
]);

// Matter.js의 Bodies.fromVertices 함수를 사용하여 다각형을 생성합니다.
const customWall = Bodies.fromVertices(window.innerWidth / 2, window.innerHeight / 2, customWallVertices, {
    isStatic: true,
    render: {
        fillStyle: 'red',
    },
});

World.add(engine.world, customWall);

// 다른 물리적 객체 추가 (여기서는 간단한 바닥 추가)
const ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight, window.innerWidth, 10, { isStatic: true });
World.add(engine.world, ground);

const balls = [];

function createBall(x, y) {
    const ball = Bodies.circle(x, y, 30, {
        restitution: 0.8,
        render: {
            fillStyle: 'black',
        },
    });
    World.add(engine.world, ball);
    balls.push(ball);
}

render.canvas.addEventListener('mousedown', function (event) {
    createBall(event.clientX, event.clientY);
});

// 충돌 이벤트 감지
Events.on(engine, 'collisionStart', function (event) {
    const pairs = event.pairs;
    for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i];
        // 충돌한 객체들 중에서 공이나 벽인 경우에만 소리 재생
        if ((balls.includes(pair.bodyA) && customWall === pair.bodyB) ||
            (customWall === pair.bodyA && balls.includes(pair.bodyB))) {
            playBounceSound();
        }
    }
});

function playBounceSound() {
    new Audio('glasseffect.mp3').play(); // 'glasseffect.mp3' 파일로 변경
}

function update() {
    for (let i = 0; i < balls.length; i++) {
        const ball = balls[i];
        // 이 부분에서 필요한 업데이트 로직을 추가
    }
}

// beforeUpdate 이벤트 내에서 겹침 감지와 충돌 감지를 분리하여 처리
Events.on(engine, 'beforeUpdate', function () {
    // 겹침 감지 로직 추가
});

// 충돌 감지 로직을 추가
Events.on(engine, 'collisionStart', function (event) {
    // 충돌 이벤트 처리
});

// 반복적으로 업데이트 함수 호출
Events.on(engine, 'beforeUpdate', function () {
    update();
});

// 뷰포트 크기가 변경될 때마다 사용자 지정 다각형 벽의 위치 업데이트
window.addEventListener('resize', function () {
    Matter.Body.setPosition(customWall, { x: window.innerWidth / 2, y: window.innerHeight / 2 });
    Matter.Vertices.clockwiseSort(customWall.vertices); // 정렬이 필요할 수 있음
    // 뷰포트 크기에 따라 꼭짓점을 다시 생성합니다.
    const newVertices = createCustomWallVertices();
    Matter.Vertices.update(customWall.vertices, newVertices);
});

// 초기와 리사이즈 이벤트에서 사용되는 사용자 지정 다각형 벽의 꼭짓점 생성 함수
function createCustomWallVertices() {
    const width = window.innerWidth / 4; // 원하는 크기로 조절
    const height = window.innerHeight / 4; // 원하는 크기로 조절

    return Vertices.create([
        { x: -width / 2, y: -height / 2 },
        { x: width / 2, y: -height / 2 },
        { x: width / 2, y: height / 2 },
        { x: -width / 2, y: height / 2 },
    ]);
}
