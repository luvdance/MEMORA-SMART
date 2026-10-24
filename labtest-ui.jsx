import { createRoot } from "react-dom/client";
import "/src/academy/academy.css";
import "/src/academy/academy-learn.css";
import NodeLab from "/src/academy/components/NodeLab.jsx";
import { LESSONS } from "/src/academy/data/lessons/be-w1-web.js";
const atom = LESSONS[1].atoms[0];
createRoot(document.getElementById("root")).render(<NodeLab id="ui-test" {...atom.nodeLab} onSolved={() => (window.__solved = true)} />);
