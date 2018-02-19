import React from 'react';
import HeatMap from './heatmap/HeatMap'
import Collapsible from 'react-collapsible'
import { API_ROOT } from '../api-config';
import { withRouter } from 'react-router-dom';
import {PaneLeft, PaneRight} from './Pane'
import Button from './Button'
import ModelIntro from './ModelIntro'


/*******************************************************************************
  <McInput /> Component
*******************************************************************************/

const mcExamples = [
    {
      passage: "On May 21, 2013, NFL owners at their spring meetings in Boston voted and awarded the game to Levi's Stadium. The $1.2 billion stadium opened in 2014. It is the first Super Bowl held in the San Francisco Bay Area since Super Bowl XIX in 1985, and the first in California since Super Bowl XXXVII took place in San Diego in 2003.",
      question: "Who voted on the venue for Super Bowl 50?",
    },
    {
      passage: "Super Bowl 50 was an American football game to determine the champion of the National Football League (NFL) for the 2015 season. The American Football Conference (AFC) champion Denver Broncos defeated the National Football Conference (NFC) champion Carolina Panthers 24â€“10 to earn their third Super Bowl title. The game was played on February 7, 2016, at Levi's Stadium in the San Francisco Bay Area at Santa Clara, California. As this was the 50th Super Bowl, the league emphasized the \"golden anniversary\" with various gold-themed initiatives, as well as temporarily suspending the tradition of naming each Super Bowl game with Roman numerals (under which the game would have been known as 'Super Bowl L'), so that the logo could prominently feature the Arabic numerals 50.",
      question: "What city did Super Bowl 50 take place in?",
    },
    {
      passage: "The Matrix is a 1999 science fiction action film written and directed by The Wachowskis, starring Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss, Hugo Weaving, and Joe Pantoliano. It depicts a dystopian future in which reality as perceived by most humans is actually a simulated reality called \"the Matrix\", created by sentient machines to subdue the human population, while their bodies' heat and electrical activity are used as an energy source. Computer programmer \"Neo\" learns this truth and is drawn into a rebellion against the machines, which involves other people who have been freed from the \"dream world.\"",
      question: "Who stars in The Matrix?",
    },
    {
      passage: "Kerbal Space Program (KSP) is a space flight simulation video game developed and published by Squad for Microsoft Windows, OS X, Linux, PlayStation 4, Xbox One, with a Wii U version that was supposed to be released at a later date. The developers have stated that the gaming landscape has changed since that announcement and more details will be released soon. In the game, players direct a nascent space program, staffed and crewed by humanoid aliens known as \"Kerbals\". The game features a realistic orbital physics engine, allowing for various real-life orbital maneuvers such as Hohmann transfer orbits and bi-elliptic transfer orbits.",
      question: "What does the physics engine allow for?",
    }
];

const title = "Machine Comprehension";
const description = (
  <span>
    <span>
      Machine Comprehension (MC) answers natural language questions by selecting an answer span within an evidence text.
      The AllenNLP toolkit provides the following MC visualization, which can be used for any MC model in AllenNLP.
      This page demonstrates a reimplementation of
    </span>
    <a href = "https://www.semanticscholar.org/paper/Bidirectional-Attention-Flow-for-Machine-Comprehen-Seo-Kembhavi/007ab5528b3bd310a80d553cccad4b78dc496b02" target="_blank" rel="noopener noreferrer">{' '} BiDAF (Seo et al, 2017)</a>
    <span>
      , or Bi-Directional Attention Flow,
      a widely used MC baseline that achieved state-of-the-art accuracies on
    </span>
    <a href = "https://rajpurkar.github.io/SQuAD-explorer/" target="_blank" rel="noopener noreferrer">{' '} the SQuAD dataset {' '}</a>
    <span>
      (Wikipedia sentences) in early 2017.
    </span>
  </span>
);


class McInput extends React.Component {
constructor(props) {
    super(props);

    // If we're showing a permalinked result,
    // we'll get passed in a passage and question.
    const { passage, question } = props;

    this.state = {
      mcPassageValue: passage || "",
      mcQuestionValue: question || ""
    };
    this.handleListChange = this.handleListChange.bind(this);
    this.handleQuestionChange = this.handleQuestionChange.bind(this);
    this.handlePassageChange = this.handlePassageChange.bind(this);
}

handleListChange(e) {
    if (e.target.value !== "") {
      this.setState({
          mcPassageValue: mcExamples[e.target.value].passage,
          mcQuestionValue: mcExamples[e.target.value].question,
      });
    }
}

handlePassageChange(e) {
    this.setState({
      mcPassageValue: e.target.value,
    });
}

handleQuestionChange(e) {
    this.setState({
    mcQuestionValue: e.target.value,
    });
}

render() {

    const { mcPassageValue, mcQuestionValue } = this.state;
    const { outputState, runMcModel } = this.props;

    const mcInputs = {
    "passageValue": mcPassageValue,
    "questionValue": mcQuestionValue
    };

    return (
        <div className="model__content">
        <ModelIntro/> 
            <div className="form__instructions"><span>Enter text or</span>
            <select disabled={outputState === "working"} onChange={this.handleListChange}>
                <option value="">Choose an example...</option>
                {mcExamples.map((example, index) => {
                  return (
                      <option value={index} key={index}>{example.passage.substring(0,60) + "..."}</option>
                  );
                })}
            </select>
            </div>
            <div className="form__field">
            <label htmlFor="#input--mc-passage">Passage</label>
            <textarea onChange={this.handlePassageChange} id="input--mc-passage" type="text" required="true" autoFocus="true" placeholder="E.g. &quot;Saturn is the sixth planet from the Sun and the second-largest in the Solar System, after Jupiter. It is a gas giant with an average radius about nine times that of Earth. Although it has only one-eighth the average density of Earth, with its larger volume Saturn is just over 95 times more massive. Saturn is named after the Roman god of agriculture; its astronomical symbol represents the god&#39;s sickle.&quot;" value={mcPassageValue} disabled={outputState === "working"}></textarea>
            </div>
            <div className="form__field">
            <label htmlFor="#input--mc-question">Question</label>
            <input onChange={this.handleQuestionChange} id="input--mc-question" type="text" required="true" value={mcQuestionValue} placeholder="E.g. &quot;What does Saturn’s astronomical symbol represent?&quot;" disabled={outputState === "working"} />
            </div>
            <div className="form__field form__field--btn">
            <Button enabled={outputState !== "working"} runModel={runMcModel} inputs={mcInputs} />
            </div>
        </div>
        );
    }
}


/*******************************************************************************
  <McOutput /> Component
*******************************************************************************/

class McOutput extends React.Component {

    ColorLuminance(hex, lum) {

	// validate hex string
	hex = String(hex).replace(/[^0-9a-f]/gi, '');
	if (hex.length < 6) {
		hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
	}
	lum = lum || 0;

	// convert to decimal and change luminosity
	var rgb = "#", c, i;
	for (i = 0; i < 3; i++) {
		c = parseInt(hex.substr(i*2,2), 16);
		c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
		rgb += ("00"+c).substr(c.length);
	}

	return rgb;
}



    render() {
      const { passage, answer, attention, question_tokens, passage_tokens, best_confs, best_starts, best_ends } = this.props;

//      const start = passage.indexOf(answer);
//      const head = passage.slice(0, start);
//      const tail = passage.slice(start + answer.length);

//      const best_confs = [1.5019152499462507e-07, 6.246895623007731e-07, 0.9867215156555176];
//      const best_starts = [0, 2, 5];
//      const best_ends = [0, 3, 5];

      var modHtml = ""

      var start = passage.indexOf(passage_tokens[best_starts[0]]);
      const head = passage.slice(0, start);
      var lastWord = passage_tokens[best_ends[best_ends.length-1]];
      var end = passage.indexOf(lastWord) + lastWord.length;
      const tail = passage.slice(end, passage.length);

      const newBg = this.ColorLuminance("40affd", 0.1);

//      If your number X falls between A and B, and you would like Y to fall between C and D, you can apply the following linear transform:
//
//      Y = (X-A)/(B-A) * (D-C) + C



      for(var i = 0; i < best_confs.length; i++){

            start = passage.indexOf(passage_tokens[best_starts[i]]);

            var spanLastWord = passage_tokens[best_ends[i]];
            var lastWordIndex = passage.indexOf(spanLastWord)
            var end = lastWordIndex + spanLastWord.length;

            var answerSpan = passage.slice(start, end);

            modHtml += "<span style=\"color:#000; background: " +newBg+ ";\">"+ answerSpan +"</span>";

            if(i+1 < best_confs.length){

                start = passage.indexOf(passage_tokens[best_ends[i]]) +  passage_tokens[best_ends[i]].length;

                end = passage.indexOf(passage_tokens[best_starts[i+1]]);

                var plainText = passage.slice(start, end);

                modHtml += "<span>"+ plainText +"</span>";
            }
      }

//        const concatAnswer = "<span style=\"color:#fff; background: " +newBg+ ";\">"+ answer +"</span>";


      return (


        <div className="model__content">
          <div className="form__field">
            <label>Answer</label>
            <div className="model__content__summary">{ answer }</div>
          </div>

          <div className="form__field">
            <label>Passage Context</label>
            <div className="passage model__content__summary">
              <span>{head}</span>
              <span dangerouslySetInnerHTML={{__html: modHtml}}></span>
              <span>{tail}</span>
              <div>
              <span> {head.length} </span>
              </div>
              <div>
              <span> {tail.length}</span>
              </div>

            </div>
          </div>
        </div>
      );
    }
  }




//        const styles = {
//            container: {
//              background: "#40affd",
//              color: "#fff"
//            }
//        };

//        const concatAnswer = "<span style=\"color:#fff; background:#40affd;\">"+ answer +"</span>";

//
//        const responseStringFull =  '<div className="model__content">' +
//          '<div className="form__field">' +
//            '<label>Answer</label>' +
//            '<div className="model__content__summary">{ answer }</div>' +
//          '</div>' +
//
//          '<div className="form__field">' +
//            '<label>Passage Context</label>' +
//            '<div className="passage model__content__summary">' +
//              '<span>' + head + '</span>' +
//              '<span style={background: "#40affd", color: "#fff"}>'+ answer +'</span>' +
//              '<span>' + tail + '</span>' +
//            '</div>' +
//          '</div>' +
//        '</div>';
//
//        const responseString = "<span style={background: \"#40affd\", color: \"#fff\"}>"+ answer +"</span>";



/*******************************************************************************
  <McComponent /> Component
*******************************************************************************/

class _McComponent extends React.Component {
    constructor(props) {
      super(props);

      const { requestData, responseData } = props;

      this.state = {
        outputState: responseData ? "received" : "empty", // valid values: "working", "empty", "received", "error"
        requestData: requestData,
        responseData: responseData
      };

      this.runMcModel = this.runMcModel.bind(this);
    }

    runMcModel(event, inputs) {
      this.setState({outputState: "working"});

      var payload = {
        passage: inputs.passageValue,
        question: inputs.questionValue,
      };
      fetch(`${API_ROOT}/predict/machine-comprehension`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      }).then((response) => {
        return response.json();
      }).then((json) => {
        // If the response contains a `slug` for a permalink, we want to redirect
        // to the corresponding path using `history.push`.
        const { slug } = json;
        const newPath = slug ? '/machine-comprehension/' + slug : '/machine-comprehension';

        // We'll pass the request and response data along as part of the location object
        // so that the `Demo` component can use them to re-render.
        const location = {
          pathname: newPath,
          state: { requestData: payload, responseData: json }
        }
        this.props.history.push(location);
      }).catch((error) => {
        this.setState({outputState: "error"});
        console.error(error);
      });
    }

    render() {
      const { requestData, responseData } = this.props;

      const passage = requestData && requestData.passage;
      const question = requestData && requestData.question;
      const answer = responseData && responseData.best_span_str;
      const attention = responseData && responseData.passage_question_attention;
      const question_tokens = responseData && responseData.question_tokens;
      const passage_tokens = responseData && responseData.passage_tokens;

      const best_confs = [1.5019152499462507e-07, 6.246895623007731e-07, 0.9867215156555176];
      const best_starts = [0, 2, 5];
      const best_ends = [0, 3, 5];

      return (
        <div className="pane model">
          <PaneLeft>
            <McInput runMcModel={this.runMcModel}
                     outputState={this.state.outputState}
                     passage={passage}
                     question={question}/>
          </PaneLeft>
          <PaneRight outputState={this.state.outputState}>
            <McOutput passage={passage}
                      answer={answer}
                      attention={attention}
                      question_tokens={question_tokens}
                      passage_tokens={passage_tokens}
                      best_confs = {best_confs}
                      best_starts = {best_starts}
                      best_ends = {best_ends}/>
          </PaneRight>
        </div>
      );

    }
}

const McComponent = withRouter(_McComponent);

export default McComponent;
