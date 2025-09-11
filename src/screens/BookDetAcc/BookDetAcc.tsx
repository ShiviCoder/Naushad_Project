import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import BookDetHead from './BookDetHead'
import BookDetMiddle from './BookDetMiddle'
import BookDetProfile from './BookDetProfile'
import BookDetLoc from './BookDetLoc'
import BookDetBottom from './BookDetBottom'

const BookDetAcc = () => {
  return (
    <View>
      <BookDetHead />
      <BookDetMiddle />
      <BookDetProfile />
      <BookDetLoc/>
      <BookDetBottom/>
    </View>
  )
}

export default BookDetAcc

const styles = StyleSheet.create({

})