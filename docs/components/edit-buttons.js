import React from 'react';
import urls from './urls';
import prettier from 'prettier/standalone';
import parserCss from 'prettier/parser-postcss';
import parserJs from 'prettier/parser-babylon';
// import parserHtml from 'prettier/parser-html';
import stripMd from 'remove-markdown';

class EditButtons extends React.Component {
    render() {
        let { css, code, frontMatter, rawHtml, head, url } = this.props;
        // regex to find and extract css and scripts in html
        const srcRegex = /src=("|')([^']*?)("|')/g,
            hrefRegex = /href=("|')([^']*?)("|')/g,
            scriptRegex = /<script>((.|\n)*)<\/script>/,
            cssRegex = /<style>((.|\n)*)<\/style>/,
            moreCss = rawHtml.match(cssRegex);
        // output for code panels
        let html = rawHtml.replace(scriptRegex, ''),
            js = code.match(scriptRegex)[1],
            resources = {
                js: [urls.js()],
                css: [urls.css()]
            };
        // metadata
        let title = frontMatter.title,
            tags = ['mapbox', 'maps'],
            description = frontMatter.description;
        // append link back to the example in the description
        description += `\n\nSee the example: [${url}](${url})`;
        // extract inline css from html, append to css var, then remove from html output
        if (moreCss) {
            css += moreCss[0].replace('</style>', '').replace('<style>', '');
            html = html.replace(cssRegex, '');
        }
        // extract inline scripts from html, add them as resources, then remove from html output
        if (rawHtml.match(srcRegex)) {
            const srcArr = rawHtml
                .match(srcRegex)
                .map(src => src.replace('src=', '').replace(/["']/g, ''));
            resources.js = resources.js.concat(srcArr);
            html = html.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/g, '');
        }
        // extract inline stylesheets from html, add them as resources, then remove from html output
        if (rawHtml.match(hrefRegex)) {
            const hrefArr = rawHtml
                .match(hrefRegex)
                .map(src => src.replace('href=', '').replace(/["']/g, ''));
            resources.css = resources.css.concat(hrefArr);
            html = html.replace(/<link[\s\S]*?>/g, '');
        }
        // format css
        css = prettier.format(css, { parser: 'css', plugins: [parserCss] });
        // format js
        js = prettier.format(js, { parser: 'babel', plugins: [parserJs] });
        // formt html
        // html = prettier.format(html, { parser: 'html', plugins: [parserHtml] });

        const btnClass = 'btn btn--s cursor-pointer round';

        return (
            <div
                className="absolute-mm mb6 mb0-mm top right mr36-mm z2"
                style={{ marginTop: '4px' }}
            >
                <form
                    className="inline-block"
                    method="post"
                    action="http://jsfiddle.net/api/post/library/pure/"
                >
                    <input
                        style={{ border: 0 }}
                        type="submit"
                        className={btnClass}
                        value="Edit in JSFiddle"
                        onClick={() => {
                            if (window && window.analytics) {
                                analytics.track('Clicked Edit in JSFiddle');
                            }
                        }}
                    />
                    <input type="hidden" name="wrap" value="b" />
                    <input type="hidden" name="css" value={css} />
                    <input type="hidden" name="html" value={html} />
                    <input type="hidden" name="js" value={js} />
                    <input type="hidden" name="title" value={title} />
                    <input
                        type="hidden"
                        name="resources"
                        value={resources.js.concat(resources.css)}
                    />
                    <input
                        type="hidden"
                        name="description"
                        value={stripMd(description)}
                    />
                </form>

                <form
                    className="inline-block ml6"
                    action="https://codepen.io/pen/define"
                    method="POST"
                >
                    <input
                        type="hidden"
                        name="data"
                        value={JSON.stringify({
                            title: title,
                            html: html,
                            description: description,
                            tags: tags,
                            css: css,
                            js: js,
                            css_external: resources.css.join(';'),
                            js_external: resources.js.join(';'),
                            head: head
                        })}
                    />

                    <input
                        style={{ border: 0 }}
                        type="submit"
                        className={btnClass}
                        value="Edit in CodePen"
                        onClick={() => {
                            if (window && window.analytics) {
                                analytics.track('Clicked Edit in CodePen');
                            }
                        }}
                    />
                </form>
            </div>
        );
    }
}

export default EditButtons;
