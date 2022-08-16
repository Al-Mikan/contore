export {};
var exp_point : number = 0;
var times = Array(101);
var acc = Array(101);

/*
    経験値の仕様
    時間(秒) - 10が得られる経験値
    自分のレベルによる傾斜は行わない
*/

// 初期化
function init() {
    for (var i = 0; i <= 100; i++) {
        times[i] = 600 + 60 * i;
    }

    for (var i = 0; i <= 100; i++) {
        acc[i + 1] = acc[i] + times[i];
    }
}

// プレイヤーの現在のレベルを取得
function get_level(exp: number): number {
    var res: number = 0;
    for (var i = 0; i<= 100; i++) {
        if (acc[i] <= exp) {
            res = i;
        }
    }

    return res;
}

// 入力された時間を経験値に変化して加算
function add_point(time: number) {
    var exp = time_to_point(time);
    exp_point += exp;
}

// 入力された時間を経験値に変換
function time_to_point(time: number): number {
    var time_minute: number = time / 60;
    var time_point: number = time_minute - 10;
    return time_point;
}

function main() {
    init();
}

main();