let leadpress_modal = (show = true) => {
    if (show) {
        jQuery("#leadpress-modal").show();
    } else {
        jQuery("#leadpress-modal").hide();
    }
};

jQuery(function ($) {
    // edit lead
    $(".leadpress-edit").on("click", function () {
        $(this).hide();
        $(this).prev().show();

        ["col_name", "col_email"].forEach(element => {
            $(this)
                .parent()
                .parent()
                .find(`.${element} input`)
                .attr("disabled", false);
        });
    });

    // save lead
    $(".leadpress-save").on("click", function () {
        $(this).hide();
        $(this).next().show();

        ["col_name", "col_email"].forEach(element => {
            $(this)
                .parent()
                .parent()
                .find(`.${element} input`)
                .attr("disabled", true);
        });

        // update lead
        var id = $(this).data("id");
        var name = $(this).parent().parent().find(".col_name input").val();
        var email = $(this).parent().parent().find(".col_email input").val();

        leadpress_modal();

        $.ajax({
            url: `${LEADPRESS.api_base}/lead/${id}/update`,
            type: "PUT",
            data: {
                nonce: LEADPRESS.rest_nonce,
                name: name,
                email: email,
            },
            success: function (resp) {
                leadpress_modal(false);

                console.log(resp);
            },
            error: function (err) {
                leadpress_modal(false);

                console.log(err);
            },
        });
    });

    // delete lead
    $(".leadpress-delete").on("click", function () {
        var id = $(this).data("id");

        leadpress_modal();

        $.ajax({
            url: `${LEADPRESS.api_base}/lead/${id}/delete`,
            type: "DELETE",
            data: {
                nonce: LEADPRESS.rest_nonce,
            },
            success: function (resp) {
                leadpress_modal(false);

                window.location.reload();
                // console.log(resp);
            },
            error: function (err) {
                leadpress_modal(false);

                console.log(err);
            },
        });
    });

    $(document).ready(function () {
        $(".leadpress-export-options").select2({
            placeholder: LEADPRESS.s_placeholder,
            allowClear: true,
        });
    });

    // leadpress csv export
    $("#leadpress-export-leads").on("click", function () {
        var data = $(".leadpress-export-options").val();

        if (data.length === 0) {
            data = ["id", "name", "email", "date"];
        }

        leadpress_modal();

        $.ajax({
            url: `${LEADPRESS.api_base}/leads/export`,
            type: "POST",
            data: {
                nonce: LEADPRESS.rest_nonce,
                fields: JSON.stringify(data),
            },
            success: function (resp) {
                leadpress_modal(false);

                // console.log(resp);

                download_csv(resp.data, "leads");
            },
            error: function (err) {
                leadpress_modal(false);

                console.log(err);
            },
        });
    });
});

function download_csv(csv_data, filename) {
    let csvContent =
        "data:text/csv;charset=utf-8," +
        csv_data.map(e => e.join(",")).join("\n");

    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
}
