import CONSTANTS from "../constants.mjs";

/**
 * Creates a dialogue button positioned near the given token.
 * The button is automatically removed if the token is not hovered
 * and the mouse is not over the button
 * 
 * @param {Token} token 
 * @returns {HTMLDivElement}
 */
function createDialogueButton(token) {
  const b = token.bounds;

  const div = document.createElement("div");
  Object.assign(div.style, {
    position: "absolute",
    top: `${b.top}px`,
    right: `${b.right}px`,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: TokenLayer.layerOptions.zIndex + 1,
    fontSize: `${b.width / 5}px`
  });

  const a = document.createElement("a");
  a.className = "branch-out button-dialogue-canvas fa-solid fa-message-dots fa-beat";

  div.appendChild(a);

  a.addEventListener("mouseleave", () => {
    if (!token.hover) {
      div.remove();
      token.dialogueButton = null;
    }
  });

  a.addEventListener("click", () => {
    const panel = ui[CONSTANTS.MODULE_ID].dialoguePanel;
    panel.bind(token.document);
  });

  return div;
}

/**
 * Handles the hover state of a token, creating or removing the dialogue button accordingly.
 * The button is removed if the token is no longer hovered and the mouse is not over the button.
 * 
 * @param {Token} token 
 * @param {Boolean} isHovering 
 * @returns 
 */
export default function onHoverToken(token, isHovering) {
  const haveDialogue = token.document.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.TOKEN_FLAGS.HAVE_DIALOGUE);
  const dialogueID = token.document.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.TOKEN_FLAGS.DIALOGUE_ID);

  if (!haveDialogue || !dialogueID) return;

  if (!isHovering && token.dialogueButton) {
    setTimeout(() => {
      if (!token.dialogueButton?.matches(":hover")) {
        token.dialogueButton?.remove();
        token.dialogueButton = null;
      }
    }, 100);
    return;
  }

  if (!token.dialogueButton) {
    token.dialogueButton = createDialogueButton(token);
    document.getElementById("hud")?.appendChild(token.dialogueButton);
  }
}
