import P5 from 'p5';
import Box from './box';

const s = function(p) {
    let tex;
    let boxes = [];

    function reset() {
        while(boxes.length > 0) {
            boxes.pop();
        }
        boxes.push(new Box(-p.width/4, 0, 0, tex));
        boxes.push(new Box(p.width/4, 0, 0, null));
    };

    p.preload = function() {
        tex = p.loadImage('./assets/texture.jpg');
    };

    p.setup = function() {
        p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
        reset();
    };

    p.draw = function() {
        let fc = p.frameCount;

        p.background(1);
        p.rotateY(fc * 0.01);

        boxes.forEach(function(e) {
            e.draw(p);
        });
    };

    p.windowResized = function() {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        reset();
    };
};

new P5(s);
