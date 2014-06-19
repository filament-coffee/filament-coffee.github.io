var imgs = document.querySelectorAll('img');

[].slice.call(imgs).filter(function (i) {
    return i.src.match(/.svg$/);
}).forEach(replaceSVG);

function replaceSVG(el) {
    var svg = document.createElement('svg');

    GET(el.src, function (err, content) {
        if (err) return console.log('Error loading', el.src, err);

        svg.innerHTML = content;

        insertAfter(svg, el);
        el.parentNode.removeChild(el);

        animateSVG(svg);
    });
}


function GET(url, cb) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);

    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            cb(null, request.responseText);
        } else {
            cb(request.status);
        }
    };

    request.onerror = function () {
        cb('Error');
    };

    request.send();
}

function insertAfter(newEl, target) {
    var parent = target.parentNode;

    if (parent.lastchild === target) {
        parent.appendChild(newEl);
    } else {
        parent.insertBefore(newEl, target.nextSibling);
    }
}

function animateSVG(svg) {
    var path = svg.querySelector('#Group-3 path');
    var pathSpeed = 1200;
    var fadeSpeed = 1500;
    var fadeDelay = 1000;

    animatePath(path, pathSpeed);

    [].slice.call(svg.querySelectorAll('#Filament-Logo > path')).forEach(function (path) {
        path.style.fill = 'none';
        path.style.stroke = 'rgba(0,0,0,1)';
        path.style.strokeWidth = 2;
        animatePath(path, fadeSpeed, fadeDelay);
        animateFillOpacity(path, fadeSpeed, 2000);
    });

    [].slice.call(svg.querySelectorAll('#Group-16 > path')).forEach(function (path, i) {
        if (i === 0) {
            animatePath(path, fadeSpeed, 1000);
        } else {
            path.style.fill = 'none';
            path.style.stroke = 'rgba(0,0,0,1)';
            path.style.strokeWidth = 2;
            animatePath(path, fadeSpeed, fadeDelay);
            animateFillOpacity(path, fadeSpeed, 2000);
        }
    });
}

function animatePath(path, duration, delay) {
    var currentFrame = 0;
    var totalFrames = Math.floor(duration/16.66);
    var length = path.getTotalLength();
    var offset = length;
    var handle;

    delay = delay || 0;

    path.style.strokeDasharray = length + ' ' + length;
    path.style.strokeDashoffset = length;

    var draw = function () {
        var progress = currentFrame / totalFrames;

        if (offset >= 2*length) {
            window.cancelAnimationFrame(handle);
        } else {
            currentFrame++;
            offset = length + Math.floor(length * (progress));
            if (offset > 2*length) {
                offset = 2*length;
            }
            path.style.strokeDashoffset = offset;
            handle = window.requestAnimationFrame(draw);
        }
    };

    setTimeout(draw, delay);
}

function animateOpacity(el, duration, delay) {
    var currentFrame = 0;
    var totalFrames = Math.floor(duration/16.66);
    var handle;

    delay = delay || 0;
    el.style.opacity = 0;


    var draw = function () {
        var progress = currentFrame / totalFrames;

        if (progress >= 1) {
            window.cancelAnimationFrame(handle);
            el.style.opacity = 1;
        } else {
            currentFrame++;
            el.style.opacity = progress;
            handle = window.requestAnimationFrame(draw);
        }
    };

    setTimeout(draw, delay);
}


function animateFillOpacity(el, duration, delay) {
    var currentFrame = 0;
    var totalFrames = Math.floor(duration/16.66);
    var handle;

    delay = delay || 0;
    el.style.fill = 'rgba(0,0,0,0)';


    var draw = function () {
        var progress = currentFrame / totalFrames;

        if (progress >= 1) {
            window.cancelAnimationFrame(handle);
            el.style.fill = 'rgba(0,0,0,1)';
            el.style.stroke = 'rgba(0,0,0,0)';
        } else {
            currentFrame++;
            el.style.fill = 'rgba(0,0,0,' + progress + ')';
            el.style.stroke = 'rgba(0,0,0,' + (1-progress) + ')';
            handle = window.requestAnimationFrame(draw);
        }
    };

    setTimeout(draw, delay);
}
