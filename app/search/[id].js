import React, { useEffect, useState, useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity,
  View,
  Text,
  SafeAreaView,
} from "react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";

import { ScreenHeaderBtn, NearbyJobCard } from "../../components";
import { COLORS, icons, SIZES } from "../../constants";
import styles from "../../styles/search";
import Constants from "expo-constants";

const JobSearch = () => {
  const params = useLocalSearchParams();
  const router = useRouter();

  const [searchResult, setSearchResult] = useState([]);
  const [searchLoader, setSearchLoader] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [page, setPage] = useState(1);

  const apiKey =
    Constants.expoConfig?.extra?.RAPIDAPI_KEY ||
    Constants.manifest2?.extra?.RAPIDAPI_KEY ||
    "";

  const handleSearch = useCallback(async () => {
    setSearchLoader(true);
    setSearchResult([]);
    setSearchError(null);

    console.log("Using API Key:", apiKey);

    try {
      const options = {
        method: "GET",
        url: "https://jsearch.p.rapidapi.com/search",
        headers: {
          "X-RapidAPI-Key": apiKey,
          "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
        },
        params: {
          query: params.id,
          page: page.toString(),
          country: "eg",
        },
      };

      const response = await axios.request(options);
      setSearchResult(response.data.data);
    } catch (error) {
      setSearchError(error);
      console.log(error);
    } finally {
      setSearchLoader(false);
    }
  }, [apiKey, params.id, page]);

  const handlePagination = (direction) => {
    if (direction === "left" && page > 1) {
      setPage((prev) => prev - 1);
    } else if (direction === "right") {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.lightWhite },
          headerShadowVisible: false,
          headerLeft: () => (
            <View style={{ marginLeft: 10 }}>
              <ScreenHeaderBtn
                iconUrl={icons.left}
                dimension="60%"
                handlePress={() => router.back()}
              />
            </View>
          ),
          headerTitle: "",
        }}
      />

      <FlatList
        data={searchResult}
        renderItem={({ item }) => (
          <NearbyJobCard
            job={item}
            handleNavigate={() => router.push(`/job-details/${item.job_id}`)}
          />
        )}
        keyExtractor={(item) => item.job_id}
        contentContainerStyle={{ padding: SIZES.medium, rowGap: SIZES.medium }}
        ListHeaderComponent={() => (
          <>
            <View style={styles.container}>
              <Text style={styles.searchTitle}>{params.id}</Text>
              <Text style={styles.noOfSearchedJobs}>Job Opportunities</Text>
            </View>
            <View style={styles.loaderContainer}>
              {searchLoader ? (
                <ActivityIndicator size="large" color={COLORS.primary} />
              ) : (
                searchError && <Text>Oops, something went wrong.</Text>
              )}
            </View>
          </>
        )}
        ListFooterComponent={() => (
          <View style={styles.footerContainer}>
            <TouchableOpacity
              style={styles.paginationButton}
              onPress={() => handlePagination("left")}
            >
              <Image
                source={icons.chevronLeft}
                style={styles.paginationImage}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <View style={styles.paginationTextBox}>
              <Text style={styles.paginationText}>{page}</Text>
            </View>
            <TouchableOpacity
              style={styles.paginationButton}
              onPress={() => handlePagination("right")}
            >
              <Image
                source={icons.chevronRight}
                style={styles.paginationImage}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default JobSearch;
