import { useState, useRef } from 'react'
import 'aframe'

const questions = [
  {
    mission: 'MISSION 01',
    question: 'Which shape has 6 faces?',
    correct: 'cube',
  },
  {
    mission: 'MISSION 02',
    question: 'Which shape has no corners?',
    correct: 'sphere',
  },
  {
    mission: 'MISSION 03',
    question: 'Which shape has 2 circular faces?',
    correct: 'cylinder',
  },
  {
    mission: 'MISSION 04',
    question: 'Which shape is RED?',
    correct: 'cube',
  },
  {
    mission: 'MISSION 05',
    question: 'Which shape is BLUE?',
    correct: 'sphere',
  },
  {
    mission: 'MISSION 06',
    question: 'Which shape is YELLOW?',
    correct: 'cylinder',
  },
]


// =====================================
// SAFE VR POSITIONS
// =====================================

const positions = [
  '-5 1.7 -4',   // left front
  '5 1.7 -4',    // right front
  '-5 1.7 0',    // left
  '5 1.7 0',     // right
  '-4 1.7 4',    // left back
  '4 1.7 4',     // right back
  '0 1.7 5',     // directly behind
  '0 1.7 -6',    // directly in front
]


// =====================================
// RANDOM POSITION FUNCTION
// =====================================

function getRandomPositions() {
  const shuffled = [...positions].sort(
    () => Math.random() - 0.5
  )

  return {
    cube: shuffled[0],
    sphere: shuffled[1],
    cylinder: shuffled[2],
  }
}
// =====================================
// FLOATING SHAPE COMPONENT
// =====================================

if (!(window as any).AFRAME.components['float-shape']) {
  (window as any).AFRAME.registerComponent('float-shape', {
    schema: {
      amount: { type: 'number', default: 0.15 },
      speed: { type: 'number', default: 0.002 },
    },

    init() {
      const position = this.el.getAttribute('position')

      this.baseY = position.y
      this.startTime = performance.now()
    },

    tick(time: number) {
      const elapsed = time - this.startTime

      const y =
        this.baseY +
        Math.sin(elapsed * this.data.speed) *
          this.data.amount

      this.el.object3D.position.y = y
    },
  })
}


function App() {

  const [questionIndex, setQuestionIndex] =
    useState(0)

  const [score, setScore] =
    useState(0)

  const [message, setMessage] =
    useState('')

  const [gameComplete, setGameComplete] =
    useState(false)

  const [shapePositions, setShapePositions] =
    useState(getRandomPositions())


  const audioContextRef =
    useRef<AudioContext | null>(null)


  // =====================================
  // SOUND EFFECTS
  // =====================================

  const playSound = (
    type:
      | 'correct'
      | 'wrong'
      | 'complete'
  ) => {

    const AudioContextClass =
      window.AudioContext ||
      (window as any).webkitAudioContext

    if (!audioContextRef.current) {
      audioContextRef.current =
        new AudioContextClass()
    }

    const audioContext =
      audioContextRef.current

    if (
      audioContext.state ===
      'suspended'
    ) {
      audioContext.resume()
    }

    const oscillator =
      audioContext.createOscillator()

    const gainNode =
      audioContext.createGain()

    oscillator.connect(gainNode)

    gainNode.connect(
      audioContext.destination
    )

    let frequency = 440

    if (type === 'correct')
      frequency = 660

    if (type === 'wrong')
      frequency = 220

    if (type === 'complete')
      frequency = 880

    oscillator.frequency.value =
      frequency

    oscillator.type = 'sine'

    gainNode.gain.setValueAtTime(
      0.15,
      audioContext.currentTime
    )

    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.3
    )

    oscillator.start()

    oscillator.stop(
      audioContext.currentTime + 0.3
    )
  }


  const currentQuestion =
    questions[questionIndex]


  // =====================================
  // CHECK ANSWER
  // =====================================

  const checkAnswer =
    (shape: string) => {

      if (gameComplete)
        return

      if (
        shape ===
        currentQuestion.correct
      ) {

        playSound('correct')

        setScore(
          previousScore =>
            previousScore + 10
        )

        setMessage(
          'CORRECT! +10 🎉'
        )

        setTimeout(() => {

          setMessage('')

          if (
            questionIndex <
            questions.length - 1
          ) {

            setShapePositions(getRandomPositions())
setQuestionIndex(
  previousIndex =>
    previousIndex + 1
)

          } else {

            playSound('complete')

            setGameComplete(true)

          }

        }, 1500)

      } else {

        playSound('wrong')

        setMessage(
          'TRY AGAIN!'
        )
      }
    }


  // =====================================
  // PLAY AGAIN
  // =====================================

  const playAgain = () => {

    setQuestionIndex(0)

    setScore(0)

    setMessage('')

    setGameComplete(false)

    // NEW RANDOM POSITIONS
    setShapePositions(
      getRandomPositions()
    )
  }


  return (

    <div
      style={{
        width: '100vw',
        height: '100vh',
      }}
    >

      {/* ================================= */}
      {/* VR SCENE */}
      {/* ================================= */}

      <a-scene
        embedded
        vr-mode-ui="enabled: true"
        webxr="optionalFeatures: local-floor, bounded-floor"
      >


        {/* ================================= */}
        {/* SKY */}
        {/* ================================= */}

        <a-sky
  color="#87CEEB"
></a-sky>


        {/* ================================= */}
        {/* FLOOR */}
        {/* ================================= */}

        <a-plane
  position="0 0 0"
  rotation="-90 0 0"
  width="30"
  height="30"
  color="#5f9f45"
></a-plane>

        {/* ================================= */}
        {/* LIGHTING */}
        {/* ================================= */}

        <a-light
          type="ambient"
          intensity="1"
        ></a-light>

        <a-light
          type="directional"
          position="-3 6 4"
          intensity="1.5"
        ></a-light>

{/* ================================= */}
{/* HARVEST TOWN TREES */}
{/* ================================= */}

<a-entity position="-8 0 -6">

  {/* Tree trunk */}
  <a-cylinder
    radius="0.35"
    height="2"
    color="#6b4423"
    position="0 1 0"
  ></a-cylinder>

  {/* Tree leaves */}
  <a-sphere
    radius="1.5"
    color="#3f7f3a"
    position="0 2.5 0"
  ></a-sphere>

</a-entity>


<a-entity position="8 0 -5">

  <a-cylinder
    radius="0.35"
    height="2"
    color="#6b4423"
    position="0 1 0"
  ></a-cylinder>

  <a-sphere
    radius="1.5"
    color="#3f7f3a"
    position="0 2.5 0"
  ></a-sphere>

</a-entity>


<a-entity position="-8 0 5">

  <a-cylinder
    radius="0.35"
    height="2"
    color="#6b4423"
    position="0 1 0"
  ></a-cylinder>

  <a-sphere
    radius="1.5"
    color="#3f7f3a"
    position="0 2.5 0"
  ></a-sphere>

</a-entity>


<a-entity position="8 0 5">

  <a-cylinder
    radius="0.35"
    height="2"
    color="#6b4423"
    position="0 1 0"
  ></a-cylinder>

  <a-sphere
    radius="1.5"
    color="#3f7f3a"
    position="0 2.5 0"
  ></a-sphere>

</a-entity>

{/* ================================= */}
{/* HARVEST TOWN CLOUDS */}
{/* ================================= */}

<a-entity position="-5 7 -8">

  <a-sphere
    radius="1.2"
    color="#ffffff"
  ></a-sphere>

  <a-sphere
    radius="1.5"
    color="#ffffff"
    position="1.2 0.2 0"
  ></a-sphere>

  <a-sphere
    radius="1"
    color="#ffffff"
    position="2.4 0 0"
  ></a-sphere>

</a-entity>


<a-entity position="5 8 -10">

  <a-sphere
    radius="1.1"
    color="#ffffff"
  ></a-sphere>

  <a-sphere
    radius="1.4"
    color="#ffffff"
    position="1.2 0.1 0"
  ></a-sphere>

  <a-sphere
    radius="0.9"
    color="#ffffff"
    position="2.3 0 0"
  ></a-sphere>

</a-entity>

        {/* ================================= */}
        {/* QUESTION PANEL */}
        {/* ================================= */}

        {!gameComplete && (

          <a-entity
            position="0 4 -7"
          >

            <a-plane
              width="6"
              height="1.5"
              color="#ffffff"
            ></a-plane>


            <a-text
              value={
                currentQuestion.mission
              }
              align="center"
              color="#6c4ab6"
              width="5"
              position="0 0.45 0.02"
            ></a-text>


            <a-text
              value={
                currentQuestion.question
              }
              align="center"
              color="#111111"
              width="5"
              position="0 -0.05 0.02"
            ></a-text>


            <a-text
              value="LOOK AROUND AND FIND THE ANSWER!"
              align="center"
              color="#555555"
              width="4.5"
              position="0 -0.45 0.02"
            ></a-text>

          </a-entity>

        )}


        {/* ================================= */}
        {/* SCORE */}
        {/* ================================= */}

        {!gameComplete && (

          <a-text
            value={`SCORE: ${score}`}
            position="-5 3.5 -6"
            color="#ffffff"
            width="4"
          ></a-text>

        )}


        {/* ================================= */}
        {/* MESSAGE */}
        {/* ================================= */}

        {!gameComplete && (

          <a-text
            value={message}
            position="0 2.8 -6"
            align="center"
            color="#ffffff"
            width="5"
          ></a-text>

        )}


        {/* ================================= */}
        {/* FINAL SCORE */}
        {/* ================================= */}

        {gameComplete && (

          <a-entity
            position="0 2.5 -6"
          >

            <a-plane
              width="6"
              height="4"
              color="#ffffff"
            ></a-plane>


            <a-text
              value="MISSION COMPLETE! 🏆"
              align="center"
              color="#6c4ab6"
              width="5"
              position="0 1.2 0.05"
            ></a-text>


            <a-text
              value="YOUR FINAL SCORE"
              align="center"
              color="#555555"
              width="4"
              position="0 0.5 0.05"
            ></a-text>


            <a-text
              value={`${score} / 60`}
              align="center"
              color="#111111"
              width="6"
              position="0 -0.1 0.05"
            ></a-text>


            <a-text
              value="Great job! 🎉"
              align="center"
              color="#6c4ab6"
              width="4"
              position="0 -0.7 0.05"
            ></a-text>


            {/* PLAY AGAIN */}

            <a-plane
              className="clickable"
              width="3"
              height="0.9"
              color="#6c4ab6"
              position="0 -1.4 0.05"

              animation__mouseenter="
                property: scale;
                to: 1.1 1.1 1.1;
                startEvents: mouseenter;
                dur: 200
              "

              animation__mouseleave="
                property: scale;
                to: 1 1 1;
                startEvents: mouseleave;
                dur: 200
              "

              onClick={
                playAgain
              }
            ></a-plane>


            <a-text
              value="PLAY AGAIN"
              align="center"
              color="#ffffff"
              width="4"
              position="0 -1.4 0.1"
            ></a-text>

          </a-entity>

        )}


        {/* ================================= */}
        {/* CUBE */}
        {/* ================================= */}

        <a-box
          className="clickable"

          position={
            shapePositions.cube
          }
          float-shape="amount: 0.15; speed: 0.002"
          
          rotation="0 30 0"
          animation__rotate="
  property: rotation;
  to: 0 390 0;
  loop: true;
  dur: 12000;
  easing: linear;
"

          color="#e85d3f"

          depth="2"
          height="2"
          width="2"

          animation__mouseenter="
            property: scale;
            to: 1.2 1.2 1.2;
            startEvents: mouseenter;
            dur: 200
          "

          animation__mouseleave="
            property: scale;
            to: 1 1 1;
            startEvents: mouseleave;
            dur: 200
          "

          onClick={() =>
            checkAnswer('cube')
          }
        ></a-box>


        {/* ================================= */}
        {/* SPHERE */}
        {/* ================================= */}

        <a-sphere
          className="clickable"

          position={
            shapePositions.sphere
          }
          float-shape="amount: 0.20; speed: 0.0018"
          
          radius="1.2"

          color="#4d7cff"

          animation__rotate="
  property: rotation;
  to: 360 360 360;
  loop: true;
  dur: 10000;
  easing: linear;
"

          animation__mouseenter="
            property: scale;
            to: 1.2 1.2 1.2;
            startEvents: mouseenter;
            dur: 200
          "

          animation__mouseleave="
            property: scale;
            to: 1 1 1;
            startEvents: mouseleave;
            dur: 200
          "

          onClick={() =>
            checkAnswer('sphere')
          }
        ></a-sphere>


        {/* ================================= */}
        {/* CYLINDER */}
        {/* ================================= */}

        <a-cylinder
          className="clickable"

          position={
            shapePositions.cylinder
          }

          float-shape="amount: 0.18; speed: 0.002"
          
          radius="1"

          height="2.5"

          color="#f2c94c"
          animation__rotate="
  property: rotation;
  to: 360 360 0;
  loop: true;
  dur: 12000;
  easing: linear;
"

          animation__mouseenter="
            property: scale;
            to: 1.2 1.2 1.2;
            startEvents: mouseenter;
            dur: 200
          "

          animation__mouseleave="
            property: scale;
            to: 1 1 1;
            startEvents: mouseleave;
            dur: 200
          "

          onClick={() =>
            checkAnswer('cylinder')
          }
        ></a-cylinder>


        {/* ================================= */}
        {/* CAMERA + CURSOR */}
        {/* ================================= */}

        <a-camera
          position="0 1.6 2"
        >

          <a-cursor
            raycaster="objects: .clickable"
            fuse="false"
          ></a-cursor>

        </a-camera>


      </a-scene>

    </div>
  )
}

export default App