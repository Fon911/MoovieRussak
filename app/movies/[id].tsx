import { icons } from "@/constants/icons";
import { fetchMoviesDetailt } from "@/services/api";
import useFetch from "@/services/useFetch";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface MovieInfoProps {
  label: string;
  value?: string | number | null;
}

const MovieInfo = ({ label, value }: MovieInfoProps) => {
  return (
    <View className="flex-col items-start justify-center mt-5">
      <Text className="text-light-200 font-normal text-sm">{label}</Text>
      <Text className="text-light-200 font-bold text-sm mt-2">
        {value || "N/A"}
      </Text>
    </View>
  );
};

const MovieDetails = () => {
  const { id } = useLocalSearchParams();
  const { data: movie, loading } = useFetch(() =>
    fetchMoviesDetailt(id as string)
  );

  const insets = useSafeAreaInsets();
  return (
    <View className="bg-primary flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`,
            }}
            className="w-full h-[550px]"
            resizeMode="stretch"
          />
        </View>
        <View className="flex-col items-start mt-5 justify-center mx-5">
          <Text className="text-white text-xl font-bold">{movie?.title}</Text>
          <View className="flex-row itmes-center gap-x-1 mt-2">
            <Text className="text-light-200 text-sm">
              {movie?.release_date
                ? movie.release_date.split("-").reverse().join(".")
                : ""}
            </Text>
            <Text className="text-light-200 text-sm">{movie?.runtime}m</Text>
          </View>
          <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2">
            <Image source={icons.star} className="w-4 h-4" />
            <Text className="text-white font-bold text-sm">
              {movie?.vote_average
                ? Math.round(movie.vote_average * 10) / 10
                : "N/A"}{" "}
              /10
            </Text>
            <Text className="text-light-200 text-sm">
              ({movie?.vote_count ? movie.vote_count : "N/A"}) votes
            </Text>
          </View>
          <MovieInfo label="Overview" value={movie?.overview} />
          <MovieInfo
            label="Genres"
            value={movie?.genres?.map((g) => g.name).join("-" || "NA")}
          />
          <View className="flex flex-row justify-between w-1/2">
            <MovieInfo
              label="Budget"
              value={`$${movie?.budget / 1_000_000 || "N/A"} million`}
            />
            <MovieInfo
              label="Revenue"
              value={`$${
                movie?.revenue ? (movie.revenue / 1_000_000).toFixed(1) : "N/A"
              } million`}
            />
          </View>
          <MovieInfo
            label="Productinon Companies"
            value={movie?.production_companies
              ?.map((c) => c.name)
              .join("-" || "NA")}
          />
        </View>
      </ScrollView>
      <TouchableOpacity
        className="absolute left-0 right-0 bg-accent mx-5 rounded-lg py-3.5 flex flex-row items-center justify-center z-50"
        style={{ bottom: insets.bottom + 10 }} // ✅ Учитываем безопасную зону
        onPress={() => router.back()}
      >
        <Image
          source={icons.arrow}
          className="w-5 h-5 mr-1 mt-0.5 rotate-180"
          tintColor="#fff"
        />
        <Text className="text-white font-semibold text-base">Go back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MovieDetails;
