import React from 'react'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
import { Container } from '@chakra-ui/react'
import {
    Button,
    Input,
    InputGroup,
    InputLeftElement,
    InputRightAddon,
    Stack,
    Text,
    Heading,
    useToast
} from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";
import { Flex, Spacer } from '@chakra-ui/react'
import { Spinner } from '@chakra-ui/react'
import { UserState } from '../context/ContextProvider'

import Navbar from "../components/Navbar/Navbar"
import ImgCard from '../components/Card/ImgCard'

const Home = () => {

    const history = useHistory()
    const { Id } = useParams()
    const [post, setPost] = useState([])
    const [user, setUser] = useState(null)
    const [query, setQuery] = useState("")
    const [searchLoading, setSearchLoading] = useState(false)
    const toast = useToast()
    const { changer, setChanger } = UserState()


    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo || userInfo === null) {
            history.push('/')
        } else {
            setUser(userInfo)
            // setUser(userInfo)
            setPost([])
            getPost(userInfo)

        }
        // console.log("User is "+user)
    }, [changer])


    const getPost = async (userInfo) => {

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        // console.log(Id)
        if (!Id) {
            try {
                const { data } = await axios.get('https://ai-drisya.onrender.com/api/post', config)
                setPost(data)
            } catch (error) {
                toast({
                    title: 'Error Occured',
                    description: 'Server Error',
                    position:'top-right',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                  })
            }
        } else {
            try {
                const { data } = await axios.post('https://ai-drisya.onrender.com/api/post/user', { _id: Id }, config)
                setPost(data)
            } catch (error) {
                toast({
                    title: 'Error Occured',
                    description: 'Server Error',
                    position:'top-right',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                  })
            }
        }

    }

    const handleSearch = async () => {

        if (query.length < 2) {
            alert('Minimun query length should be 2')
            return
        }
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        }
        const temp = post
        try {
            setPost([])
            setSearchLoading(true)
            const { data } = await axios.post('https://ai-drisya.onrender.com/api/post/heading', { heading: query }, config)
            if(data.length==0){
                setPost(temp)
                toast({
                    title: 'No Result',
                    description: 'No Such post exists',
                    position:'top-right',
                    status: 'info',
                    duration: 5000,
                    isClosable: true,
                  })
            }else{
                setPost(data)
            }
            setQuery("")
        } catch (error) {
            setPost(temp)
            toast({
                title: 'Error Occured',
                description: 'Server Error',
                position:'top-right',
                status: 'error',
                duration: 5000,
                isClosable: true,
              })
        } finally {
            setSearchLoading(false)
        }

    }


    return (
        <>
            <Navbar />

            <Stack mt="4rem" spacing={4} as={Container} maxW={'3xl'} textAlign={'center'}>
                <Heading fontSize={{ base: '2xl', sm: '4xl' }} fontWeight={'bold'}>
                The Community Showcase
                </Heading>
                <Text color={'gray.600'} fontSize={{ base: 'sm', sm: 'lg' }}>
                Browse through a collection of imaginative and visually stunning images generated by AI DRISYA
                </Text>
            </Stack>

            <Container maxW='750px' >
                <InputGroup borderRadius={5} size="sm" my={10} >
                    <InputLeftElement
                        pointerEvents="none"
                        children={<Search2Icon color="gray.600" />}
                    />
                    <Input type="text" placeholder="Search..." border="1px solid #949494"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <InputRightAddon
                        p={0}
                        border="none"
                    >
                        <Button onClick={handleSearch} size="sm" backgroundColor="blue.500" color="white"
                            borderLeftRadius={0} borderRightRadius={3.3} border="1px solid #949494"
                            isLoading={searchLoading} loadingText="Loading"
                        >
                            Search
                        </Button>
                    </InputRightAddon>
                </InputGroup>

            </Container>
            <Container maxW={{ base: '99%', md: '90%', lg: '85%' }}>
                <Flex flexWrap="wrap" justifyContent="center" alignItems="center" >

                    {/* <img src="https://image.lexica.art/full_jpg/6efe7b5c-538e-4a1c-af1e-90022cf03e5e" width="500" height="600" /> */}
                    {post.length > 0 && post.map((p) => {
                        return (<ImgCard key={p._id} post={p} />)
                    })}
                    {post.length === 0 &&
                        <Spinner
                            thickness='4px'
                            speed='0.65s'
                            emptyColor='gray.200'
                            color='blue.500'
                            size='xl'
                        />
                    }
                </Flex>
            </Container>
        </>
    )
}

export default Home