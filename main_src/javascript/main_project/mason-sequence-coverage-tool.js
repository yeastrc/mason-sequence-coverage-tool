/**
 *  mason-sequence-coverage-tool.js
 *
 *  Javascript
 */

//  Color must be RGB Hex
var _UN_EXPANDED_COLOR = "#FF0000"
var _EXPANDED_COLOR = "#0000FF"


/**
 *  Button Click Handler
 */
var sequence_coverage_generate_image_button_Clicked = function () {

    var $masonViewerRootDiv = $("#sequence_coverage_mason_instance");

    //  "#svg-not-supported" specifies id of div on page that will be shown if SVG is not supported.
    //  $svg_not_supported.show();  is called.

    var $svg_not_supported = $("#mason-viewer-svg-not-supported");

    var $mason_viewer_failed_to_create = $("#mason-viewer-generic-json-failed-to-create");

    var masonData = get_masonData()

    if ( ! masonData ) {
        return
    }

    var create_MasonViewer_Generic_JSON_Pre_Built_ConstructorParams =
        { config:
                {
                    mason_data: masonData,

                    $masonViewerRootDiv: $masonViewerRootDiv,
                    $svgNotSupportedDiv: $svg_not_supported,
                    $mason_viewer_failed_to_create: $mason_viewer_failed_to_create } };

    var create_MasonViewer_Generic_JSON_Pre_Built = new Create_MasonViewer_Generic_JSON_Pre_Built( create_MasonViewer_Generic_JSON_Pre_Built_ConstructorParams );

    create_MasonViewer_Generic_JSON_Pre_Built.createCoverageMapIfNotCreated();

}

var $sequence_coverage_generate_image_button = $("#sequence_coverage_generate_image_button")

$sequence_coverage_generate_image_button.click( sequence_coverage_generate_image_button_Clicked )



/**
 *  Compute Mason Data and return
 *
 *  @returns null if either input field is empty
 */
var get_masonData = function () {

    var $sequence_coverage_protein_sequence = $("#sequence_coverage_protein_sequence")
    var protein_sequence = $sequence_coverage_protein_sequence.val()

    protein_sequence = $.trim(protein_sequence);

    if ( protein_sequence === "" ) {
        return null
    }

    var peptideEntries = get_PeptideEntries();

    var peptideBlocks = []

    for ( const peptideEntry of peptideEntries ) {

        let indexOf_Start = 0
        let peptideIndex = -1;
        while ( ( peptideIndex = protein_sequence.indexOf( peptideEntry, indexOf_Start ) ) !== -1 ) {

            var peptideBlock = {
                "startPos": peptideIndex + 1,
                "endPos": peptideIndex + peptideEntry.length,
                "tooltip":peptideEntry,
            }

            peptideBlocks.push( peptideBlock )

            indexOf_Start = peptideIndex + 1
        }
    }


    var masonData = {
        "sequenceLength": protein_sequence.length,
        "rows": [
            {
                "label": "Seq Coverage",
                "color": _UN_EXPANDED_COLOR,
                "xcolor": _EXPANDED_COLOR,
                "blocks": peptideBlocks
            }
            ]
    }

    return masonData;
}

/**
 *  Compute Mason Data and return
 *
 *  @returns null if either input field is empty
 */
var get_PeptideEntries = function () {

    var $sequence_coverage_peptide_sequences = $("#sequence_coverage_peptide_sequences")
    var sequence_coverage_peptide_sequences = $sequence_coverage_peptide_sequences.val()

    sequence_coverage_peptide_sequences = $.trim(sequence_coverage_peptide_sequences);

    if ( sequence_coverage_peptide_sequences === "" ) {
        return null
    }


    var peptideEntries = [];

    //		Javascript to convert all line endings to \n

    sequence_coverage_peptide_sequences = sequence_coverage_peptide_sequences.replace(/(\r\n|\r|\n)/g, '\n');

    //    Split into an array of lines

    var peptideLines = sequence_coverage_peptide_sequences.split(/\n/g);


    for ( var lineIndex = 0; lineIndex < peptideLines.length; lineIndex++ ) {

        var peptideLine = peptideLines[lineIndex];

        peptideLine = $.trim(peptideLine);

        if (peptideLine.length === 0) {

            continue;
        }

        peptideEntries.push( peptideLine )
    }

    return peptideEntries;
}
