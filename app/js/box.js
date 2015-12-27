export default class Box {
    constructor(x, y, z, texture) {
        this._x = x;
        this._y = y;
        this._z = z;
        this._texture = texture;
    }

    draw(p) {
        let cnt = p.frameCount % 360;

        p.push();
        p.translate(this._x, this._y, this._z);

        p.ambientLight(55,55,55);
        p.pointLight(255, 255, 255, 0, -300, 300);

        p.specularMaterial(255,255,0);
        p.rotateX(p.radians(cnt));
        p.rotateY(p.radians(cnt));
        if(this._texture) {
            p.texture(this._texture);
        }
        p.box(100);
        p.pop();
    }
};
