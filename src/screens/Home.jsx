import * as React from "react"
import {
  View,
  SafeAreaView,
  Text,
  Pressable,
  ImageBackground,
  Dimensions,
  Image,
} from "react-native"

const Home = (props) => {
  const windowWidth = Dimensions.get("window").width
  const windowHeight = Dimensions.get("window").height

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#dfebf6",
        width: "100%",
      }}
    >
      <ImageBackground
        style={{
          flex: 1,
          width: windowWidth * 1,
        }}
        source={require("../pictures/BG.png")}
      >
        <Image
          source={require("../../assets/icon.png")}
          style={{
            width: 400,
            height: 400,
            alignSelf: "center",
          }}
        ></Image>
        <View
          style={{
            width: "100%",
            alignItems: "center",
          }}
        >
          <Pressable
            style={{
              backgroundColor: "#44576D",
              borderRadius: 50,
              width: windowWidth * 0.5,
              alignItems: "center",
              justifyContent: "center",
              borderStartColor: "black",
              borderWidth: 3,
              borderColor: "#29353c",
              shadowColor: "#44576D",
              shadowOpacity: 100,
              shadowRadius: 20,
              elevation: 200,
              marginTop: 10,
              shadowOffset: 20,
            }}
            onPress={() => props.navigation.navigate("Easy")}
            title="Easy"
          >
            <Text
              style={{
                fontSize: 50,
                color: "#f3f3f3",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              Easy
            </Text>
          </Pressable>

          <Pressable
            style={{
              backgroundColor: "#44576D",
              borderRadius: 50,
              width: windowWidth * 0.5,
              alignItems: "center",
              justifyContent: "center",
              borderStartColor: "black",
              borderWidth: 3,
              borderColor: "#29353c",
              shadowColor: "#44576D",
              shadowOpacity: 100,
              shadowRadius: 20,
              elevation: 200,
              marginTop: 10,
              shadowOffset: 20,
            }}
            onPress={() => props.navigation.navigate("Medium")}
            title="Medium"
          >
            <Text
              style={{
                fontSize: 45,
                color: "#f3f3f3",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              Medium
            </Text>
          </Pressable>

          <Pressable
            style={{
              backgroundColor: "#44576D",
              borderRadius: 50,
              width: windowWidth * 0.5,
              alignItems: "center",
              justifyContent: "center",
              borderStartColor: "black",
              borderWidth: 3,
              borderColor: "#29353c",
              shadowColor: "#44576D",
              shadowOpacity: 100,
              shadowRadius: 20,
              elevation: 200,
              marginTop: 10,
              shadowOffset: 20,
            }}
            onPress={() => props.navigation.navigate("Hard")}
            title="Hard"
          >
            <Text
              style={{
                fontSize: 50,
                color: "#f3f4f3",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              Hard
            </Text>
          </Pressable>
        </View>
      </ImageBackground>
    </SafeAreaView>
  )
}

export default Home
