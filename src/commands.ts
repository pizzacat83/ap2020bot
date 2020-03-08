import {slack, SlackCommandParams} from './common';

declare var global: any;

global.slackCommands = {};

const getTeXImageURL = (tex: string): string => {
  const response = UrlFetchApp.fetch('http://latex2png.com/api/convert', {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({
      auth: {
        user: "guest",
        password: "guest"
      },
      latex: tex,
      resolution: 200,
      color: "7f807f"
    }),
  });
  const res = JSON.parse(response.getContentText());
  if (res["result-code"] === 0) {
    Logger.log(res);
    Logger.log(res.url);
    return `http://latex2png.com${res.url}`;
  } else {
    throw new Error(res["result-message"]);
  }
};

/// #if DEBUG
global.getTeXImageURL = getTeXImageURL;
/// #endif

const tex = (params: SlackCommandParams): {} => {
  try {
    // if you want to change username or icon,
    // you should use postMessage instead.
    const re = /([^]*?)(\$\$?)([^]+?)\2/g;
    const blocks = [];
    let last_index = 0;
    while (1) {
      const match = re.exec(params.text);
      if (!match) break;
      const [fullMatch, text, _, tex] = match;
      last_index += fullMatch.length;
      if (text) {
        blocks.push({
          type: 'section',
          text: {
            type: 'mrkdwn',
            text
          }
        });
      }
      blocks.push({
        type: 'image',
        image_url: getTeXImageURL(tex),
        alt_text: tex
      });
    }
    if (last_index === 0) {
      // regard full text as TeX
      blocks.push({
        type: 'image',
        image_url: getTeXImageURL(params.text),
        alt_text: params.text
      });
    } else if (last_index < params.text.length) {
      // add strings left
      blocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: params.text.substr(last_index)
        }
      });
    }
    return {
      response_type: 'in_channel',
      blocks
    };
  } catch (e) {
    return `An error occurred: ${e}`;
  }
};

global.slackCommands.tex = tex;

const question = (params: SlackCommandParams): {} => {
  // bot: @member @member @member
  const match = params.text.match(/<#(.+?)(\|.+)?>/);
  if (match) {
    const asked_channel = match[1];
    // TODO: should cache?
    const {ok, error, channel: {members}} = slack.bot.channelsInfo(asked_channel);
    if (!ok) throw new Error(error);
    return {
      response_type: 'in_channel',
      text: members.map(m => `<@${m}>`).join(' ')
    };
  } else {
    // no channel specified
    // TODO: open dialog to choose channel?
    return {
      response_type: 'ephemeral',
      text: [
        'Error: 質問先チャンネルが指定されていません。',
        '#から始まるチャンネル名をメッセージに添えて再度送信してください。'
      ].join('\n')
    };
  }
};

global.slackCommands.question = question;
