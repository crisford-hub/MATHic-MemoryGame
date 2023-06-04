import React, { useState, useEffect } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  Image,
  Pressable,
} from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { ArrowLeftIcon, ArrowPathIcon } from "react-native-heroicons/solid"
import Icon from "react-native-vector-icons/Feather"

const HardGameScreen = (props) => {
  const [cards, setCards] = useState([
    { id: 1, value: "½ of 100", answer: "50", flipped: false, matched: false }, //50
    { id: 2, value: "25x2", answer: "50", flipped: false, matched: false },
    { id: 3, value: "√100", answer: "10", flipped: false, matched: false }, //10
    { id: 4, value: "5x2", answer: "10", flipped: false, matched: false },
    { id: 5, value: "√400", answer: "20", flipped: false, matched: false }, //20
    { id: 6, value: "10x2", answer: "20", flipped: false, matched: false },
    { id: 7, value: "⅔ of 75", answer: "25", flipped: false, matched: false }, //25
    { id: 8, value: "5x10", answer: "25", flipped: false, matched: false },
    { id: 9, value: "½ of 8", answer: "4", flipped: false, matched: false }, //4
    { id: 10, value: "√16", answer: "4", flipped: false, matched: false },
    { id: 11, value: "4x4x2", answer: "32", flipped: false, matched: false }, //16
    { id: 12, value: "9x3+5", answer: "32", flipped: false, matched: false },
    { id: 13, value: "55+55", answer: "110", flipped: false, matched: false }, //110
    { id: 14, value: "6+26x4", answer: "110", flipped: false, matched: false },
    { id: 15, value: "√25", answer: "5", flipped: false, matched: false }, //5
    { id: 16, value: "⅕ of 25", answer: "5", flipped: false, matched: false },
    { id: 17, value: "√4", answer: "2", flipped: false, matched: false }, //2
    { id: 18, value: "⅕ of 10", answer: "2", flipped: false, matched: false },
    { id: 19, value: "√144", answer: "12", flipped: false, matched: false }, //12
    { id: 20, value: "⅛ of 96", answer: "12", flipped: false, matched: false },
    { id: 21, value: "¼ of 20", answer: "5", flipped: false, matched: false }, //5
    { id: 22, value: "5x5-20", answer: "5", flipped: false, matched: false },
    { id: 23, value: "√324", answer: "18", flipped: false, matched: false }, //18
    { id: 24, value: "⅒ of 180", answer: "18", flipped: false, matched: false },
  ])

  const [flippedCardIds, setFlippedCardIds] = useState([])
  const [lastFlippedCardId, setLastFlippedCardId] = useState(null)
  const [moveCount, setMoveCount] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [timer, setTimer] = useState(0)
  const [isGameComplete, setIsGameComplete] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [highScoreHard, setHighScoreHard] = useState(null)

  // font area

  useEffect(() => {
    shuffleCards()
  }, [])

  useEffect(() => {
    checkGameCompletion()
  }, [cards])

  useEffect(() => {
    let interval = null

    if (isActive) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 10)
      }, 10)
    } else {
      clearInterval(interval)
    }

    return () => clearInterval(interval)
  }, [isActive])

  const shuffleCards = () => {
    const shuffledCards = [...cards].sort(() => Math.random() - 0.5)
    setCards(shuffledCards)
  }

  const handleCardPress = (cardId) => {
    const flippedCard = cards.find((card) => card.id === cardId)
    if (flippedCard.matched || flippedCard.flipped) {
      return // Ignore already flipped or matched cards
    }

    if (flippedCardIds.length === 0) {
      // No cards flipped, flip the current card
      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === cardId ? { ...card, flipped: true } : card
        )
      )
      setFlippedCardIds([cardId])
    } else if (flippedCardIds.length === 1) {
      // One card already flipped, flip the current card and check for a match
      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === cardId ? { ...card, flipped: true } : card
        )
      )
      setFlippedCardIds((prevIds) => [...prevIds, cardId])

      const lastFlippedCard = cards.find(
        (card) => card.id === flippedCardIds[0]
      )
      if (lastFlippedCard.answer === flippedCard.answer) {
        // Cards match, mark both as matched
        setCards((prevCards) =>
          prevCards.map((card) =>
            card.id === cardId || card.id === flippedCardIds[0]
              ? { ...card, matched: true }
              : card
          )
        )
        setMoveCount((prevMoveCount) => prevMoveCount + 1)

        const isAllMatched = cards.every((card) => card.matched)
        if (isAllMatched) {
          setIsGameComplete(true)
        }

        setFlippedCardIds([])
      } else {
        // Cards don't match, reset the cards after a delay
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((card) =>
              card.id === cardId || card.id === flippedCardIds[0]
                ? { ...card, flipped: false }
                : card
            )
          )
          setFlippedCardIds([])
        }, 1500)
        setMoveCount((prevMoveCount) => prevMoveCount + 1)
      }
    }
  }

  const checkForMatch = () => {
    if (flippedCardIds.length === 2) {
      const card1 = cards.find((card) => card.id === flippedCardIds[0])
      const card2 = cards.find((card) => card.id === flippedCardIds[1])

      if (card1.answer === card2.answer) {
        // Cards match, award points
        setCards((prevCards) =>
          prevCards.map((card) =>
            flippedCardIds.includes(card.id)
              ? { ...card, matched: true, flipped: true }
              : card
          )
        )

        setMoveCount((prevMoveCount) => prevMoveCount + 1)

        const isAllMatched = cards.every((card) => card.matched)
        if (isAllMatched) {
          setIsGameComplete(true)
        }

        setFlippedCardIds([])
      } else {
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((card) =>
              flippedCardIds.includes(card.id)
                ? { ...card, flipped: false }
                : card
            )
          )

          setFlippedCardIds([])
        }, 100)
      }

      setMoveCount((prevMoveCount) => prevMoveCount + 1)
    }
  }

  const renderCards = () => {
    return cards.map((card) => (
      <TouchableOpacity
        key={card.id}
        style={[
          styles.card,
          card.flipped && styles.flippedCard,
          card.matched && styles.matchedCard, // Added matchedCard style
        ]}
        onPress={() => handleCardPress(card.id)}
        disabled={card.flipped || card.matched}
      >
        <Text style={styles.cardText}>{card.flipped ? card.value : ""}</Text>
      </TouchableOpacity>
    ))
  }
  const resetButton = () => {
    // Shuffle the cards
    const shuffledCards = [...cards].sort(() => Math.random() - 0.5)

    // Set the cards to their new state
    setCards(
      shuffledCards.map((card) => ({
        ...card,
        flipped: false,
        matched: false,
      }))
    )

    // Reset the other game state
    setMoveCount(0)
    setIsActive(false)
    setTimer(0)
    setIsGameComplete(false)
    setFlippedCardIds([])
    setShowModal(false)
  }

  const replayGame = () => {
    setShowModal(false)
    resetButton()
  }
  useEffect(() => {
    if (isGameComplete) {
      setShowModal(true)
    }
  }, [isGameComplete])
  useEffect(() => {
    retrieveHighScoreHard()
  }, [])

  const renderHighScoreHard = () => {
    if (highScoreHard !== null) {
      return (
        <Text style={styles.highScoreHardText}>
          High Score:
          <Text>
            {highScoreHard.toString()} {/* moves */}
          </Text>
        </Text>
      )
    } else {
      return null
    }
  }

  useEffect(() => {
    retrieveHighScoreHard()
  }, [])

  useEffect(() => {
    checkGameCompletion()
  }, [cards])

  const retrieveHighScoreHard = async () => {
    try {
      const value = await AsyncStorage.getItem("highScoreHard")
      if (value !== null) {
        setHighScoreHard(parseInt(value))
      }
    } catch (error) {
      console.log("Error retrieving high score: ", error)
    }
  }

  const storeHighScoreHard = async (score) => {
    try {
      await AsyncStorage.setItem("highScoreHard", score.toString())
    } catch (error) {
      console.log("Error storing high score: ", error)
    }
  }

  const checkGameCompletion = () => {
    const isAllMatched = cards.every((card) => card.matched)
    if (isAllMatched) {
      setIsGameComplete(true)

      if (moveCount < highScoreHard || highScoreHard === null) {
        storeHighScoreHard(moveCount)
        setHighScoreHard(moveCount) // Update the highScoreHardstate
      }
    }
  }

  return (
    <View style={styles.container}>
      <View
        style={{
          position: "absolute",
          top: windowHeight * 0.09,
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 25,
          width: windowWidth * 1,
          borderRadius: 10,
        }}
      >
        <Pressable
          style={{
            backgroundColor: "#a0acc4",
            width: 50,
            height: 40,
            alignItems: "center",
            justifyContent: "center",
            borderTopEndRadius: 10,
            borderBottomStartRadius: 10,
          }}
          onPress={props.navigation.goBack}
        >
          <Icon name="chevron-left" size={25} color="#44576D" />
        </Pressable>
        <View
          style={{
            height: 40,
            alignItems: "center",
            justifyContent: "center",
            borderTopEndRadius: 10,
            borderBottomStartRadius: 10,
          }}
        >
          {renderHighScoreHard()}
        </View>

        <Pressable
          onPress={resetButton}
          style={{
            backgroundColor: "#a0acc4",
            width: 50,
            height: 40,
            alignItems: "center",
            justifyContent: "center",
            borderTopEndRadius: 10,
            borderBottomStartRadius: 10,
          }}
        >
          <Icon name="rotate-ccw" size={25} color="#44576D" />
        </Pressable>
      </View>
      <View
        style={{
          position: "absolute",
          top: windowHeight * 0.2,
          alignItems: "center",
          padding: 25,
          width: windowWidth * 0.99,
          borderRadius: 10,
        }}
      >
        <Text style={styles.movesText}>{moveCount} Moves </Text>
      </View>
      <View style={styles.cardsContainer}>{renderCards()}</View>
      <Modal visible={showModal} transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Congratulations! You finished the game in {moveCount} moves.
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={props.navigation.goBack}
                style={{
                  backgroundColor: "#a0acc4",
                  width: windowWidth * 0.3,
                  height: 40,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  borderTopEndRadius: 10,
                  borderBottomStartRadius: 10,
                }}
              >
                <Icon name="home" size={25} color="#44576D" />
                <Text
                  style={{
                    fontSize: 25,
                    fontWeight: "bold",
                    color: "#44576D",
                  }}
                >
                  {" "}
                  Home
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={replayGame}
                style={{
                  backgroundColor: "#a0acc4",
                  width: windowWidth * 0.3,
                  height: 40,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  borderTopEndRadius: 10,
                  borderBottomStartRadius: 10,
                }}
              >
                <Icon name="rotate-ccw" size={25} color="#44576D" />
                <Text
                  style={{
                    fontSize: 25,
                    fontWeight: "bold",
                    color: "#44576D",
                  }}
                >
                  {" "}
                  Restart
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#dfebf6",
  },
  cardsContainer: {
    height: "50%",
    width: "100%",
    top: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    padding: 10,
  },
  card: {
    position: "relative",
    height: "21.5%",
    width: "19.5%",
    margin: 3,
    backgroundColor: "#44576D",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 3,
    borderColor: "#29353c",
  },
  flippedCard: {
    backgroundColor: "#a0acc4",
    borderColor: "#29353c",
    borderWidth: 3,
  },
  cardText: {
    color: "#29353C",
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
  },
  matchedCard: {
    backgroundColor: "#fff",
    borderColor: "#44576D",
    borderWidth: 3,
  },

  movesText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#44576D",
  },
  highScoreHardText: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#44576D",
    alignContent: "center",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#dfebf6",
    padding: 20,
    borderRadius: 10,
    width: windowWidth * 0.8,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
})

export default HardGameScreen
