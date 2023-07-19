import {Editor} from '@tinymce/tinymce-react'
import {InlineError} from "@shopify/polaris"
import {generateRandomID} from "@helpers/utils"

function RichText({value, onChange, menubar, height, label, error, compact = false, labelHidden = false}) {

	let plugins = 'fullscreen image link media table anchor advlist lists textcolor imagetools colorpicker code'
	let toolbar = 'undo redo | formatselect bold italic strikethrough blockquote forecolor backcolor | alignleft aligncenter alignright alignjustify | link image media table | numlist bullist outdent indent | removeformat code fullscreen'

	if (compact) {
		plugins = 'link textcolor colorpicker'
		toolbar = 'bold italic strikethrough blockquote forecolor alignment link'
		height = 180
	}
	return (
		<div className="richtext">
			{label && !labelHidden && (
				<div className="Polaris-Labelled__LabelWrapper">
					<div className="Polaris-Label">
						<label className="Polaris-Label__Text">{label}</label>
					</div>
				</div>
			)}
			<Editor
				apiKey={'qu8ld2f0rmt96ibv3x3w775qy2zjbp7rdotfqyefr7y9ny52'}
				init={{
					menubar: menubar || false,
					height: height || 350,
					branding: false,
					content_style: 'body {font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif; color: rgba(32, 34, 35, 1); font-size: 14px;}',
					plugins: plugins,
					toolbar: toolbar,
					setup: (editor) => {
						editor.ui.registry.addGroupToolbarButton('alignment', {
							icon: 'align-left',
							tooltip: 'Alignment',
							items: 'alignleft aligncenter alignright | alignjustify'
						});

					}
				}}
				value={value}
				onEditorChange={onChange}
			/>
			{error && <div style={{marginTop: '1rem'}}>
				<InlineError message={`${label} is required.`} fieldID={generateRandomID()}/>
			</div>}
		</div>
	)
}

export default RichText
