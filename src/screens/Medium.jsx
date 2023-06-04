import React, { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  Pressable,
} from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Icon from "react-native-vector-icons/Feather"

const MediumGameScreen = (props) => {
  const [cards, setCards] = useState([
    { id: 1, value: "2x3+5", answer: "11", flipped: false, matched: false }, //11
    { id: 2, value: "7+2x2", answer: "11", flipped: false, matched: false },
    { id: 3, value: "9x9÷3", answer: "27", flipped: false, matched: false }, //27
    { id: 4, value: "3x9", answer: "27", flipped: false, matched: false },
    { id: 5, value: "7x3-9", answer: "12", flipped: false, matched: false }, //12
    { id: 6, value: "18÷2+3", answer: "12", flipped: false, matched: false },
    { id: 7, value: "4x4+1", answer: "17", flipped: false, matched: false }, //17
    { id: 8, value: "6x4-7", answer: "17", flipped: false, matched: false },
    { id: 9, value: "6+9x2", answer: "24", flipped: false, matched: false }, //21
    { id: 10, value: "90÷3-6", answer: "24", flipped: false, matched: false },
    { id: 11, value: "12÷2", answer: "6", flipped: false, matched: false }, //6
    { id: 12, value: "2x2+2", answer: "6", flipped: false, matched: false },
    { id: 13, value: "9+9", answer: "18", flipped: false, matched: false }, //18
    { id: 14, value: "18x2÷2", answer: "18", flipped: false, matched: false },
    { id: 15, value: "15+3x5", answer: "30", flipped: false, matched: false }, //30
    { id: 16, value: "4x5+10", answer: "30", flipped: false, matched: false },
    { id: 17, value: "10+5x3", answer: "25", flipped: false, matched: false }, //25
    { id: 18, value: "5x5", answer: "25", flipped: false, matched: false },
    { id: 19, value: "2x3+4", answer: "10", flipped: false, matched: false }, //10
    { id: 20, value: "6x3-8", answer: "10", flipped: false, matched: false },
  ])

  const [flippedCardIds, setFlippedCardIds] = useState([])
  const [lastFlippedCardId, setLastFlippedCardId] = useState(null)
  const [moveCount, setMoveCount] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [timer, setTimer] = useState(0)
  const [isGameComplete, setIsGameComplete] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [highScoreMedium, setHighScoreMedium] = useState(null)

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
        }, 1250)
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
    retrieveHighScoreMedium()
  }, [])

  const renderHighScoreMedium = () => {
    if (highScoreMedium !== null) {
      return (
        <Text style={styles.highScoreMediumText}>
          High Score: {highScoreMedium.toString()} {/* moves */}
        </Text>
      )
    } else {
      return null
    }
  }

  useEffect(() => {
    retrieveHighScoreMedium()
  }, [])

  useEffect(() => {
    checkGameCompletion()
  }, [cards])

  const retrieveHighScoreMedium = async () => {
    try {
      const value = await AsyncStorage.getItem("highScoreMedium")
      if (value !== null) {
        setHighScoreMedium(parseInt(value))
      }
    } catch (error) {
      console.log("Error retrieving high score: ", error)
    }
  }

  const storeHighScoreMedium = async (score) => {
    try {
      await AsyncStorage.setItem("highScoreMedium", score.toString())
    } catch (error) {
      console.log("Error storing high score: ", error)
    }
  }

  const checkGameCompletion = () => {
    const isAllMatched = cards.every((card) => card.matched)
    if (isAllMatched) {
      setIsGameComplete(true)

      if (moveCount < highScoreMedium || highScoreMedium === null) {
        storeHighScoreMedium(moveCount)
        setHighScoreMedium(moveCount)
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
          {renderHighScoreMedium()}
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
        <Text style={styles.movesText}>{moveCount} Moves</Text>
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
  movesContainer: {
    position: "absolute",
    top: 150,
    right: 25,
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
  },
  movesText: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#44576D",
  },
  highScoreMediumText: {
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

export default MediumGameScreen
