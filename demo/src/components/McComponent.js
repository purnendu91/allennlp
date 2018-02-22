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
      passage: "Despite waiving longtime running back DeAngelo Williams and losing top wide receiver Kelvin Benjamin to a torn ACL in the preseason, the Carolina Panthers had their best regular season in franchise history, becoming the seventh team to win at least 15 regular season games since the league expanded to a 16-game schedule in 1978. Carolina started the season 14-0, not only setting franchise records for the best start and the longest single-season winning streak, but also posting the best start to a season by an NFC team in NFL history, breaking the 13-0 record previously shared with the 2009 New Orleans Saints and the 2011 Green Bay Packers. With their NFC-best 15-1 regular season record, the Panthers clinched home-field advantage throughout the NFC playoffs for the first time in franchise history. Ten players were selected to the Pro Bowl (the most in franchise history) along with eight All-Pro selections.",
      question: "What team had the best start ever in the NFL?",
    },
    {
      passage: "This was the first Super Bowl to feature a quarterback on both teams who was the #1 pick in their draft classes. Manning was the #1 selection of the 1998 NFL draft, while Newton was picked first in 2011. The matchup also pits the top two picks of the 2011 draft against each other: Newton for Carolina and Von Miller for Denver. Manning and Newton also set the record for the largest age difference between opposing Super Bowl quarterbacks at 13 years and 48 days (Manning was 39, Newton was 26).",
      question: "Who was the #2 pick in the 2011 NFL Draft?",
    },
    {
      passage: "The Panthers used the San Jose State university practice facility and stayed at the San Jose Marriott. The Broncos practiced at Florida State university Facility and stayed at the Santa Clara Marriott.",
      question: "At what university's facility did the Panthers practice?",
    },
    {
      passage: "For the first time, the Super Bowl 50 Host Committee and the NFL have openly sought disabled veteran and lesbian, gay, bisexual and transgender-owned businesses in Business Connect, the Super Bowl program that provides local companies with contracting opportunities in and around the Super Bowl. The host committee has already raised over $40 million through sponsors including Apple, Google, Yahoo!, Intel, Gap, Chevron, and Dignity Health.",
      question: "What is the name of the program that provides contracting work to local companies?",
    },
    {
      passage: "Kerbal Space Program (KSP) is a space flight simulation video game developed and published by Squad for Microsoft Windows, OS X, Linux, PlayStation 4, Xbox One, with a Wii U version that was supposed to be released at a later date. The developers have stated that the gaming landscape has changed since that announcement and more details will be released soon. In the game, players direct a nascent space program, staffed and crewed by humanoid aliens known as \"Kerbals\". The game features a realistic orbital physics engine, allowing for various real-life orbital maneuvers such as Hohmann transfer orbits and bi-elliptic transfer orbits.",
      question: "What does the physics engine allow for?",
    },
    {
      passage: "But bounding the computation time above by some concrete function f(n) often yields complexity classes that depend on the chosen machine model. For instance, the language {xx | x is any binary string} can be solved in linear time on a multi-tape Turing machine, but necessarily requires quadratic time in the model of single-tape Turing machines. If we allow polynomial variations in running time, Cobham-Edmonds thesis states that \"the time complexities in any two reasonable and general models of computation are polynomially related\" (Goldreich 2008, Chapter 1.2). This forms the basis for the complexity class P, which is the set of decision problems solvable by a deterministic Turing machine within polynomial time. The corresponding set of function problems is FP.",
      question: "A multi-tape Turing machine requires what type of time for a solution?",
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

      var modHtml = ""

      var start = passage.indexOf(passage_tokens[best_starts[0]]);
      const head = passage.slice(0, start);

      var newBg = this.ColorLuminance("40affd", 0.1);

//      If your number X falls between A and B, and you would like Y to fall between C and D, you can apply the following linear transform:
//
//      Y = (X-A)/(B-A) * (D-C) + C

      var sortedConfs = best_confs;
      sortedConfs.sort(function(a, b){return a - b});

      var spread = [];

      var newRange = sortedConfs.length - 1; // (D-C)
      var c = 0;
      var orgRange =  sortedConfs[sortedConfs.length - 1] - sortedConfs[0]; //(B-A)

      if(sortedConfs.length > 1){
        for(var i = 0; i < sortedConfs.length; i++){
            var y = (best_confs[i] - sortedConfs[0]) / orgRange * newRange;
            spread.push(y);
          }
      }else { spread.push(1); }

      var confHtml = "";

      for(var i = 0; i < best_confs.length; i++){

            var answerWords = "";

            for(var j = best_starts[i]; j <= best_ends[i]; j++){
                answerWords += passage_tokens[j];
                if(passage_tokens[j+1] != ',' && passage_tokens[j+1] != '.' && j != best_ends[i] && passage_tokens[j+1] != '-' && passage_tokens[j] != '-' && passage_tokens[j+1] != ':' && passage_tokens[j] != '#'){
                    answerWords += " ";
                }
            }

            var firstWordIndex = passage.indexOf(answerWords)
            var end = firstWordIndex + answerWords.length;

            var answerSpan = passage.slice(firstWordIndex, end);

            newBg = this.ColorLuminance("40affd", 1 - spread[i]);

            modHtml += "<span style=\"color:#000; background: " +newBg+ ";\">"+ answerSpan +"</span>";

            if(i+1 < best_confs.length){

                var startforPlain = end;

                var answerWords = "";

                for(var j = best_starts[i+1]; j <= best_ends[i+1]; j++){
                    answerWords += passage_tokens[j];
                    if(passage_tokens[j+1] != ',' && passage_tokens[j+1] != '.' && j != best_ends[i] && passage_tokens[j+1] != '-' && passage_tokens[j] != '-' && passage_tokens[j+1] != ':'){
                        answerWords += " ";
                    }
                }

                var firstWordIndex = passage.indexOf(answerWords)
                var end = firstWordIndex + answerWords.length;

                var answerSpanNext = passage.slice(firstWordIndex, end);

                end = passage.indexOf(answerSpanNext, startforPlain);

                var plainText = passage.slice(startforPlain, end);

                modHtml += "<span>"+ plainText +"</span>";

            }else{

                var plainText = passage.slice(end, passage.length);

                modHtml += "<span>"+ plainText +"</span>";
            }

            confHtml += "<span>"+ answerSpan +" : "+ best_confs[i] +"</span></br>";
      }

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
            </div>
          </div>
          <div className="form__field">
            <label>Answer Confidence</label>
            <div className="passage model__content__summary">
              <span dangerouslySetInnerHTML={{__html: confHtml}}></span>
            </div>
          </div>
        </div>
      );
    }
  }



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

      const best_confs = responseData && responseData.best_confs;
      const best_starts = responseData && responseData.best_starts;
      const best_ends = responseData && responseData.best_ends;

//      const best_confs = [1.5019152499462507e-07, 6.246895623007731e-07, 0.9867215156555176];
//      const best_starts = [0, 2, 5];
//      const best_ends = [0, 3, 5];

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
