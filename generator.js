var DEFAULT_TITLE = 'Random-Generator Generator'

function randInt(lb, ub) {
    if (lb > ub)
        lb, ub = ub, lb;

    return Math.floor(Math.random()*(ub-lb)) + lb;
}

function jumpProcess() {
    //$('#randomGenerate').unbind('click');

    var members = $('input[name=members]').val();
    var toAccept = $('input[name=toAccept]').val();
    if (members === undefined || members == ''
        || toAccept === undefined || toAccept == '') {

        document.title = DEFAULT_TITLE;
        $('#form').show();
        $('#gtor').hide();
        window.location.href = 'rgg.html';
        return;
    }
    var queryObj = {
        members: members,
        toAccept: toAccept,
    };

    window.location.href = 'rgg.html?' + $.param(queryObj);
    $('input[name=members]').val(members);
    $('input[name=toAccept]').val(toAccept);
}

function generateGenerator() {
    var members = $('input[name=members]').val();
    var toAccept = $('input[name=toAccept]').val();
    var mem = members.split(/, |%2C\+/);
    var title = '';
    for (var i = 0; i < mem.length; ++i) {
        mem[i] = decodeURIComponent(mem[i]);
        title += '「' + mem[i] + '」';
    }

    var acc = decodeURIComponent(toAccept);

    title += 'をランダムに出力して「' + acc + '」が完成したらやめるやつ';
    document.title = title;
    $('#generatorName').text(title);
    $('#form').hide();
    $('#gtor').show();
    $('#randomGenerate').on('click', function() {
        var graffiti = document.getElementById('graffiti');
        graffiti.textContent = '';
        var last = ''
        var tsurai = setInterval(function() {
            var ch = mem[randInt(0, mem.length)];
            graffiti.textContent += ch;
            last = (last + ch).substr(-acc.length);
            document.documentElement.scrollTop = document.body.scrollHeight;
            if (last == acc) {
                clearInterval(tsurai);
            }
        }, 10);
    });
}

$(function() {
    document.title = DEFAULT_TITLE;
    $('#form').show();
    $('#gtor').hide();

    var params = $.url($(location).attr('search')).param();
    $('input[name=members]').val(params.members);
    $('input[name=toAccept]').val(params.toAccept);

    $(document).on('keypress', 'input[name=members]', function(e) {
        if (e.keyCode == 13)
            jumpProcess();
    });
    $(document).on('keypress', 'input[name=toAccept]', function(e) {
        if (e.keyCode == 13)
            jumpProcess();
    });

    $('#generate').on('click', function() {
        jumpProcess();
    });

    $('#resign').on('click', function() {
        $('input[name=members]').val('');
        $('input[name=toAccept]').val('');
        jumpProcess()
        $('#gtor').hide();
        $('#form').show();
        document.title = DEFAULT_TITLE;
    });

    if (params.members == '' || params.members === undefined
        || params.toAccept == '' || params.toAccept === undefined) {

        // ...
    } else {
        generateGenerator();
    }
});
